import os
from celery import shared_task
from celery_progress.backend import ProgressRecorder
from PIL import Image
from moviepy.editor import VideoFileClip
from .models import Job
from celery.utils.log import get_task_logger
import time

celery_logger = get_task_logger(__name__)



@shared_task(bind=True)
def process_job(self, job_id):
    progress_recorder = ProgressRecorder(self)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return {"status": "FAILED", "error": "removed or invalid job id"}

    # check converted directory exists
    if not os.path.exists("./media/converted"):
        os.makedirs("./media/converted")

    # Set initial job status
    job.status = "PENDING"
    job.save()

    input_path = job.input_file.path
    input_path_replaced = input_path.replace("uploads", "converted")
    output_format = job.conversion_format.lower()
    output_path = f"{os.path.splitext(input_path_replaced)[0]}.{output_format}"

    # celery_logger.info(f"output_path:{output_path}")
    try:
        if output_format in ["jpg", "png", "jpeg", "webp"]:
            with Image.open(input_path) as img:
                img = img.convert("RGB")
                progress_recorder.set_progress(
                    50, 100, description="Processing image..."
                )
                celery_logger.info(f"output_format:{output_format}")
                img.save(output_path, output_format.upper())

        elif output_format in ["mp4", "avi"]:
            clip = VideoFileClip(input_path)
            total_duration = clip.duration

            def progress_callback(current_time):
                progress = int((current_time / total_duration) * 100)
                progress_recorder.set_progress(
                    progress, 100, description=f"Processing video... {progress}%"
                )

            # Start conversion with periodic progress updates
            for t in range(0, int(total_duration) + 1):
                time.sleep(0.1)  # Simulate time passing
                progress_callback(t)

            clip.write_videofile(output_path, codec="libx264", logger=None)

        job.status = "SUCCESS"
        job.output_file.name = output_path.replace(os.getcwd() + "/", "")
        job.result = "Conversion successful!"

    except Exception as e:
        job.status = "FAILURE"
        job.result = str(e)
        celery_logger.error(f"error: {e}")

    job.save()
    return {"status": job.status, "output_file": job.output_file.url}


