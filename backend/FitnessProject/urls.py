"""
URL configuration for FitnessProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from FitnessProject.views import SignInView, SignUpView, CategoryListCreateView, CategoryRetrieveUpdateDestroyView, \
    FitnessListCreateView, FitnessRetrieveUpdateDestroyView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('login/', SignInView.as_view(), name='sign-in'),
    path('register/', SignUpView.as_view(), name='sign-up'),

    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-retrieve-update-destroy'),

    path('fitness/', FitnessListCreateView.as_view(), name='fitness-list-create'),
    path('fitness/<int:pk>/', FitnessRetrieveUpdateDestroyView.as_view(), name='fitness-retrieve-update-destroy'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
