export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  thumbnail_url: string;
  stock: number;
  category_name: string;
  rating: number;
  in_stock: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  metadata: {
    total: number;
    page_size: number;
    source: string;
  };
  featured_banner: {
    title: string;
    discount: string;
  };
}