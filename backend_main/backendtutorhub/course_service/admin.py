from django.contrib import admin
from .models import Course, CourseRegistration
# Register your models here.
admin.site.register(CourseRegistration)
admin.site.register(Course)
