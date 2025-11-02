import requests
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

PRODUCTS_SERVICE_URL = os.getenv('PRODUCTS_SERVICE_URL', 'http://localhost:8001')


@api_view(['GET'])
def products_list_web(request):
    """
    Products List - Web
    
    BFF Web: Agrega datos de múltiples fuentes para experiencia web completa.
    Optimizado para navegadores de escritorio con datos enriquecidos.
    """
    try:
        # Obtener TODOS los productos usando el endpoint /all/
        response = requests.get(f'{PRODUCTS_SERVICE_URL}/api/products/all/')
        
        if response.status_code != 200:
            return Response(
                {'error': 'Error al obtener productos'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # El endpoint /all/ devuelve directamente una lista, no un objeto con 'results'
        products = response.json()  # Ya es una lista directamente
        
        # Enriquecer datos para web
        enriched_data = {
            'products': products,  # Asignar directamente la lista
            'metadata': {
                'total': len(products),
                'page_size': len(products),
                'source': 'BFF Web - Optimizado para escritorio'
            },
            'featured_banner': {
                'title': 'Ofertas de Black Friday',
                'discount': '50% OFF'
            }
        }
        
        return Response(enriched_data)
    
    except requests.RequestException as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def product_detail_web(request, pk):
    """
    Product Detail - Web
    
    Retorna información completa del producto incluyendo reseñas,
    productos relacionados e información de envío.
    """
    try:
        response = requests.get(f'{PRODUCTS_SERVICE_URL}/api/products/{pk}/')
        
        if response.status_code == 404:
            return Response(
                {'error': 'Producto no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        product = response.json()
        
        # Agregar información adicional para web
        product['related_products'] = []
        product['reviews'] = []
        product['shipping_info'] = 'Envío gratis en compras mayores a $50'
        
        return Response(product)
    
    except requests.RequestException as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )