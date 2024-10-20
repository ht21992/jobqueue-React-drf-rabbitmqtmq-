from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet

# job_progress

router = DefaultRouter()
router.register(r"jobs", JobViewSet)

urlpatterns = [
    # path("jobs/<int:job_id>/progress/", job_progress, name="job-progress"),
    path("celery-progress/", include("celery_progress.urls")),
    path("", include(router.urls)),
]
