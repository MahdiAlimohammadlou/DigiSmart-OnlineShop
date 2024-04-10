from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

# Create your views here.

class BaseViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    model = None
    serializer_class = None

    def get_queryset(self):
        if hasattr(self.model, 'user'):
            return self.model.objects.filter(user=self.request.user.id)
        else:
            return self.model.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        if hasattr(self.model, 'user'):
            request.data['user'] = request.user.id
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def update(self, request, pk=None):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=pk)
        if hasattr(self.model, 'user'):
            request.data['user'] = request.user.id
        serializer = self.serializer_class(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=pk)
        deleted = obj.soft_delete()
        if deleted:
            return Response({"message": "Object deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Object not found"}, status=status.HTTP_404_NOT_FOUND)


