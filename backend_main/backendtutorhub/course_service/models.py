import uuid
from django.db import models
from users_service.models import User  # import your custom user model

class Course(models.Model):
    id = models.UUIDField(  primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    linktoplaylist = models.TextField(max_length=300,blank =True)

    # FK to only teachers
    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses'
    )

    def __str__(self):
        return self.title

class CourseRegistration(models.Model):
    id = models.UUIDField(  primary_key=True, default=uuid.uuid4, editable=False)

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')  # prevent duplicate registrations

    def __str__(self):
        return f"{self.student.username} registered for {self.course.title}"
