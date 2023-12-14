from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from FitnessProject.models import Category, Fitness
from FitnessProject.serializers import SignInSerializer, SignUpSerializer, CategorySerializer, FitnessSerializer


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class FitnessListCreateView(generics.ListCreateAPIView):
    serializer_class = FitnessSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Fitness.objects.all()
        gender = self.request.query_params.get('gender', None)
        category_id = self.request.query_params.get('category', None)

        if gender:
            queryset = queryset.filter(category__created_by__gender=gender)
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset


class FitnessRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fitness.objects.all()
    serializer_class = FitnessSerializer
    permission_classes = [IsAuthenticated]