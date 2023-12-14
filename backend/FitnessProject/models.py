from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken


class User(AbstractUser):
    MALE = 'M'
    FEMALE = 'F'

    GENDER_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

class Category(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Fitness(models.Model):
    image = models.ImageField(upload_to='fitness_images/')
    video = models.FileField(upload_to='fitness_videos/', null=True, blank=True)
    description = models.TextField()
    set = models.CharField(max_length=255)
    reps = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
