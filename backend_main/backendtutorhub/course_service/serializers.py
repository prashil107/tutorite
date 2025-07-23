from django.forms import ValidationError
from rest_framework import serializers
from .models import Course, CourseRegistration
from users_service.models import User

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

    def validate_teacher(self, value):
        print("--->", value)
        if value.role != 'teacher':
            raise serializers.ValidationError("Only users with role='teacher' can be assigned as course creators.")
        return value
    
    def create(self, validated_data):
        teacher = self.context['request'].user
        validated_data['teacher'] = teacher
        print(teacher)
        return super().create(validated_data)


# Serializer for CourseRegistration model
class CourseRegistrationSerializer(serializers.ModelSerializer):
    # student = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='student'))
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = CourseRegistration
        fields = ['id','student', 'course', 'registered_at']
    
    def get_queryset(self):
        # Return only registrations by the current user
        return CourseRegistration.objects.filter(student=self.request.user)


    def create(self, validated_data):
                # Get the authenticated user from the request context
        # The request object is automatically added to the serializer context
        # by Django REST Framework's generic views.
        student = self.context['request'].user

        # Get the course object from the validated data
        course = validated_data['course']

        # Check if the user is already registered for this course
        if CourseRegistration.objects.filter(student=student, course=course).exists():
            # Raise a custom validation error with a user-friendly message
            raise ValidationError("You are already registered for this course.")

        # If not already registered, create the CourseRegistration instance
        # The student is added here from the authenticated user
        course_registration = CourseRegistration.objects.create(
            student=student,
            course=course
        )
        print(course_registration)
        return course_registration


class CoursePublicSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_at', 'linktoplaylist', 'teacher']