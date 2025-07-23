from rest_framework import generics
from .models import Course, CourseRegistration
from .serializers import CourseSerializer, CourseRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
# Course views
class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    # def perform_create(self, serializer):
    #     if (self.request.user.role != 'teacher' or self.request.user.role != 'Teacher' ):
    #         # Stop here with a 403, so students can’t create courses
    #         raise PermissionDenied("Only teachers can create courses.")
    #     serializer.save(teacher=self.request.user)

    def get_queryset(self):
        """
        This method is called by the view to get the queryset of Course objects
        to be returned. We override it to filter by the authenticated user
        who is the teacher/creator of the course.
        """
        # Ensure the user is authenticated.
        # The IsAuthenticated permission class already handles unauthenticated access,
        # but this check is good practice when accessing self.request.user.
        if self.request.user.is_authenticated:
            return Course.objects.filter(teacher=self.request.user)
        #     # Filter the Course objects to only include those
        #     # where the 'teacher' field (or whatever you named the ForeignKey
        #     # to the User model in your Course model) is the current authenticated user.
        #     # Replace 'teacher' if your ForeignKey field has a different name.
        else:
            # If for some reason an unauthenticated user reaches here (shouldn't
            # happen with IsAuthenticated), return an empty queryset.
            return Course.objects.none()


  

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        print("Allowing any user to view course details")
        # If the request method is GET, allow any user
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        # Otherwise, use the default permission (IsAuthenticated)
        else:
            permission_classes = [IsAuthenticated]
            # Or you can call super().get_permissions() to use the view's permission_classes attribute
            # permission_classes = super().get_permissions()

        return [permission() for permission in permission_classes]

# CourseRegistration views
class CourseRegistrationView(generics.ListCreateAPIView):
    queryset = CourseRegistration.objects.all()
    serializer_class = CourseRegistrationSerializer
    permission_classes = [IsAuthenticated]

    # def perform_create(self, serializer):
    #     # Automatically set the student (assuming the user is logged in)
    #     serializer.save(student=self.request.user)

    def get_queryset(self):
        # only registrations for the logged-in student
        return CourseRegistration.objects.filter(student=self.request.user)



class CourseRegistrationDetailView(generics.RetrieveDestroyAPIView):
    queryset = CourseRegistration.objects.all()
    serializer_class = CourseRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
    # ensure students can only fetch/destroy their own registrations
        return CourseRegistration.objects.filter(student=self.request.user)

class CoursePublicListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]  # Allow any user to view courses
