import requests
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

PRODUCTS_SERVICE_URL = os.getenv('PRODUCTS_SERVICE_URL', 'http://localhost:8001')


@api_view(['GET'])
def products_list_mobile(request):
    """
    BFF Mobile: Respuestas ligeras optimizadas para mobile
    """
    page = request.GET.get('page', 1)
    
    try:
        response = requests.get(
            f'{PRODUCTS_SERVICE_URL}/api/products/',
            params={'page': page, 'page_size': 10}
        )
        
        if response.status_code != 200:
            return Response(
                {'error': 'Error al obtener productos'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        data = response.json()
        
        mobile_products = []
        for product in data.get('results', []):
            mobile_products.append({
                'id': product['id'],
                'name': product['name'],
                'price': product['price'],
                'thumbnail_url': product['thumbnail_url'],
                'in_stock': product['in_stock'],
                'rating': product['rating']
            })
        
        return Response({
            'results': mobile_products,
            'page': page,
            'page_size': 10,
            'source': 'BFF Mobile - Optimizado para iOS'
        })
    
    except requests.RequestException as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def product_detail_mobile(request, pk):
    """Detalle mínimo de producto para móvil"""
    try:
        response = requests.get(f'{PRODUCTS_SERVICE_URL}/api/products/{pk}/')
        
        if response.status_code == 404:
            return Response(
                {'error': 'Producto no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        product = response.json()
        
        mobile_product = {
            'id': product['id'],
            'name': product['name'],
            'price': product['price'],
            'thumbnail_url': product['thumbnail_url'],
            'description': product['description'][:100] + '...',  # Descripción corta
            'in_stock': product['in_stock'],
            'rating': product['rating']
        }
        
        return Response(mobile_product)
    
    except requests.RequestException as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )