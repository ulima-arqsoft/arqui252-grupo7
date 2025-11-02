from django.urls import path
from . import views

urlpatterns = [
    path('products', views.products_list_web, name='products-list'),
    path('products/<int:pk>', views.product_detail_web, name='product-detail'),
]