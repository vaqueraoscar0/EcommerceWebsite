from django.urls import path
from ..views import order_views as views

urlpatterns = [
    path('add/', views.addOrderItem, name='orders-item'),
]