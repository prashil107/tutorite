import uuid
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class UserRole(models.TextChoices):
    STUDENT = 'student', 'Student'
    TEACHER = 'teacher', 'Teacher'

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False)

    username = models.CharField(max_length=50, unique=True, )  # Set 'username' as the primary key
    bio = models.CharField(max_length=400, blank=True)  # Bio field (optional)
    role = models.CharField(
        max_length=10,
        choices=UserRole.choices,  # Role field with choices (Student or Teacher)
        default=UserRole.STUDENT   # Default role is Student
    )
    # You can add other fields as needed

    # profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True) baad me dekhta hoon
    # Add 'related_name' to avoid clashes
    groups = models.ManyToManyField(
        Group,
        related_name='user_set_custom',  # Custom related name for the groups
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='user_permissions_custom',  # Custom related name for permissions
        blank=True
    )

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.role})"
