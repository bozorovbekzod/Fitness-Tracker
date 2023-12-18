from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from FitnessProject.models import User, Category, Fitness


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    tokens = serializers.SerializerMethodField(read_only=True)
    gender = serializers.CharField(source='user.gender', read_only=True)

    def get_tokens(self, obj):
        user = authenticate(username=obj['username'], password=obj['password'])
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError('Invalid credentials, please try again')

        return {
            'username': user.username,
            'tokens': self.get_tokens({'username': username, 'password': password}),
            'gender': user.gender,
        }

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username', 'gender')

    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already registered.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class CategorySerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Category
        fields = ('id', 'name', 'created_by')


class FitnessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fitness
        fields = ('id', 'image', 'video', 'description', 'set', 'reps', 'title', 'category')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email']
