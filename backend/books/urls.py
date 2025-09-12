from django.urls import path
from .import views

urlpatterns = [
  path('books/',views.books_collection,name='books_collection'),
  path('books/<int:pk>/',views.book_detail,name='book_detail'),
]