from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import Book
from .serializer import BookSerializer

@api_view(['GET', "POST"])
def books_collection(request):
    if request.method == 'GET':
        q = request.GET.get('q', '').strip()
        qs = Book.objects.all().order_by('id')
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(author__icontains=q))
        
        # Fixed variable names
        pagination = PageNumberPagination()
        page = pagination.paginate_queryset(qs, request)
        serializer = BookSerializer(page, many=True)
        return pagination.get_paginated_response(serializer.data)
    
    elif request.method == "POST":
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Fixed: return serializer.data, not errors
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'detail': "Not Found"},
                       status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Fixed spelling: serializer not serailizer
        serializer = BookSerializer(book)
        return Response(serializer.data)
    
    if request.method in ('PUT', 'PATCH'):
        partial = request.method == 'PATCH'
        serializer = BookSerializer(book, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # Fixed spelling
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
      
      
      
      
      # page = paginator.paginate_queryset(qs,request)  # ❌ Line with issue
# return paginator.get_paginated_response(serializer.data) 


# page = pagination.paginate_queryset(qs,request)  # Variable name will be mis match
# return pagination.get_paginated_response(serializer.data)