from django.urls import path
from .views import CourseListView,CoursePublicListView, CourseDetailView, CourseRegistrationView, CourseRegistrationDetailView

urlpatterns = [
    # Public endpoints first
    path('courses/public/', CoursePublicListView.as_view(), name='public-course-list'),
    # Course-related URLs
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<uuid:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Course Registration-related URLs
    path('registrations/', CourseRegistrationView.as_view(), name='course-registration-list'),
    path('registrations/<uuid:pk>/', CourseRegistrationDetailView.as_view(), name='course-registration-detail'),
]
