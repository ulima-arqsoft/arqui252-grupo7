import axios from 'axios';
import type { ProductsResponse, Product } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  // Obtener todos los productos con paginación
  async getProducts(): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(`/api/products`);
    return response.data;
  },

  // Obtener un producto por ID
  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};