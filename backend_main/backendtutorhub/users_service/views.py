# users_service/views.py


from rest_framework import viewsets, status
from .models import User
from .serializers import SignupSerializer, UserSerializer, PublicUserSerializer
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

class SignupView(APIView):
    authentication_classes = []  

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # `serializer.data` now contains access & refresh
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class UserViewSet(viewsets.ModelViewSet):
    """
    GET    /api/users/         → list users
    POST   /api/users/         → create user
    GET    /api/users/{pk}/    → retrieve user
    PUT    /api/users/{pk}/    → replace user
    PATCH  /api/users/{pk}/    → partial update
    DELETE /api/users/{pk}/    → delete user
    """
    queryset = User.objects.all()
    lookup_field = 'username'
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
class PublicUserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username','role','id']  # or any fields you want
    permission_classes = []  # allow any