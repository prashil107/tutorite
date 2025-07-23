from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken


class SignupSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    class Meta:
        model = User
        # exclude = ['password']  # or use 'fields = "__all__"' and override create()
        fields = ['id', 'username', 'password', 'email', 'role', 'access', 'refresh']
    
    
    def create(self, validated_data):
        # Pop password, create user, hash password
        pw = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(pw)
        user.save()

        # Issue JWT tokens
        tokens = RefreshToken.for_user(user)
        user.access = str(tokens.access_token)
        user.refresh = str(tokens)
        
        

        return user

    def to_representation(self, instance):
        """
        Include access & refresh in the response
        """
        data = super().to_representation(instance)
        # print(data)
        # attach tokens that were set on validated_data during create()
        return {
            'id': data['id'],
            'username': data['username'],
            'email': data.get('email'),
            'role': data.get('role'),
            'access': data.get('access'),
            'refresh': data.get('refresh'),
        }
    
class UserSerializer(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'role', 'bio']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            pw = validated_data.pop('password')
            instance.set_password(pw)
        return super().update(instance, validated_data)
    
class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']  # add any fields you want public