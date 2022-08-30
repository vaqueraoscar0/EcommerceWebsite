from django.urls import path
from ..views import product_views as views

urlpatterns = [
    path('', views.getProducts, name='products'),
    path('create/', views.createProduct, name='product-create'),
    path('<str:pk>/', views.getProduct, name='product'),

    path('delete/<str:pk>/', views.deleteProducts, name='product-delete'),
    path('update/<str:pk>/', views.updateProduct, name='product-update'),
]