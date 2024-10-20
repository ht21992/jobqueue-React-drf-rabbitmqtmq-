from django.db import models

JOB_STATUS_CHOICES = (
    ("PENDING", "PENDING"),
    ("STARTED", "STARTED"),
    ("SUCCESS", "SUCCESS"),
    ("FAILURE", "FAILURE"),
    ("RETRY", "RETRY"),
    ("REVOKED", "REVOKED"),
)


class Job(models.Model):
    submission_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=255, choices=JOB_STATUS_CHOICES, default="PENDING"
    )
    result = models.TextField(blank=True, null=True)  # store result or error message
    input_file = models.FileField(upload_to="uploads/")  # Store the uploaded file
    output_file = models.FileField(upload_to="converted/", blank=True, null=True)
    conversion_format = models.CharField(max_length=10)  # e.g., 'jpg', 'mp4'
    task_id = models.UUIDField(null=True, blank=True, unique=True)

    def __str__(self):
        return f"{self.id} - {self.status}"

    def delete_input_output_files(self, using=None, keep_parents=False):
        """this method deletes the input and output files"""
        try:
            input_storage = self.input_file.storage
            if input_storage.exists(self.input_file.name):
                input_storage.delete(self.input_file.name)
            output_storage = self.output_file.storage
            if output_storage.exists(self.output_file.name):
                output_storage.delete(self.output_file.name)

        except Exception as e:
            print(e)


    def delete(self, using=None, keep_parents=False):
        """
        this mehtod is responsible for deleting the user_profile instance .
        """
        self.delete_input_output_files()
        super().delete()