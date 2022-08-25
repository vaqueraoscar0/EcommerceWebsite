from django.urls import path
from ..views import order_views as views

urlpatterns = [
    path('add/', views.addOrderItem, name='orders-item'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]