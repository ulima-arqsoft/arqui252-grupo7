import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  status: 'sale' | 'new' | '';
  image?: string | null;
  stockLabel: string;
  stockColor: string;
}

const PRODUCT_STATUS_LABELS: Record<Product['status'], string> = {
  sale: 'Oferta',
  new: 'Nuevo',
  '': ''
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Nike Air Force 1 NDESTRUKT',
    price: 35.17,
    status: 'sale',
    image: 'product-1.webp',
    stockLabel: 'En stock',
    stockColor: '#12B76A'
  },
  {
    id: 2,
    name: 'Nike Space Hippie 04',
    price: 57.22,
    status: '',
    image: 'product-2.webp',
    stockLabel: 'En stock',
    stockColor: '#12B76A'
  },
  {
    id: 3,
    name: 'Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear',
    price: 64.78,
    status: 'sale',
    image: 'product-3.webp',
    stockLabel: 'Stock limitado',
    stockColor: '#F79009'
  },
  {
    id: 4,
    name: 'Nike Blazer Low 77 Vintage',
    price: 50.79,
    status: 'new',
    image: 'product-4.webp',
    stockLabel: 'En stock',
    stockColor: '#12B76A'
  },
  {
    id: 5,
    name: 'Nike ZoomX SuperRep Surge',
    price: 9.57,
    status: 'sale',
    image: 'product-5.webp',
    stockLabel: 'Agotado',
    stockColor: '#F97066'
  },
  {
    id: 6,
    name: 'Zoom Freak 2',
    price: 61.46,
    status: '',
    image: 'product-6.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 7,
    name: 'Nike Air Max Zephyr',
    price: 96.73,
    status: '',
    image: 'product-7.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 8,
    name: 'Jordan Delta',
    price: 63.04,
    status: 'new',
    image: 'product-8.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 9,
    name: 'Air Jordan XXXV PF',
    price: 33.18,
    status: '',
    image: 'product-9.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 10,
    name: 'Nike Waffle Racer Crater',
    price: 36.3,
    status: '',
    image: 'product-10.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 11,
    name: 'Kyrie 7 EP Sisterhood',
    price: 54.42,
    status: '',
    image: 'product-11.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 12,
    name: 'Nike Air Zoom BB NXT',
    price: 20.52,
    status: 'new',
    image: 'product-12.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 13,
    name: 'Nike Air Force 1 07 LX',
    price: 62.82,
    status: '',
    image: 'product-13.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 14,
    name: 'Nike Air Force 1 Shadow SE',
    price: 19.96,
    status: '',
    image: 'product-14.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 15,
    name: 'Nike Air Zoom Tempo NEXT%',
    price: 25.93,
    status: '',
    image: 'product-15.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 16,
    name: 'Nike DBreak-Type',
    price: 70.39,
    status: '',
    image: 'product-16.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 17,
    name: 'Nike Air Max Up',
    price: 23.11,
    status: '',
    image: 'product-17.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 18,
    name: 'Nike Air Max 270 React ENG',
    price: 67.23,
    status: '',
    image: 'product-18.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 19,
    name: 'NikeCourt Royale',
    price: 14.31,
    status: '',
    image: 'product-19.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 20,
    name: 'Nike Air Zoom Pegasus 37 Premium',
    price: 31.5,
    status: '',
    image: 'product-20.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 21,
    name: 'Nike Air Zoom SuperRep',
    price: 26.72,
    status: '',
    image: 'product-21.webp',
    stockLabel: 'Más de 5 disponibles',
    stockColor: '#12B76A'
  },
  {
    id: 22,
    name: 'NikeCourt Royale',
    price: 44.8,
    status: '',
    image: 'product-22.webp',
    stockLabel: 'Reposición en camino',
    stockColor: '#F79009'
  },
  {
    id: 23,
    name: 'Nike React Art3mis',
    price: 37.87,
    status: '',
    image: 'product-23.webp',
    stockLabel: 'En stock',
    stockColor: '#12B76A'
  },
  {
    id: 24,
    name: 'Nike React Infinity Run Flyknit A.I.R. Chaz Bear',
    price: 75.53,
    status: '',
    image: 'product-24.webp',
    stockLabel: 'En stock',
    stockColor: '#12B76A'
  }
];

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent {
  readonly products = PRODUCTS;

  trackByProductId = (_index: number, product: Product) => product.id;

  imageUrl(image?: string | null): string {
    return image ? `url('assets/images/product/${image}')` : 'none';
  }

  hasImage(image?: string | null): boolean {
    return Boolean(image);
  }

  statusLabel(status: Product['status']): string {
    return PRODUCT_STATUS_LABELS[status];
  }

  statusClass(status: Product['status']): string {
    return status ? `product-card__badge--${status}` : '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);
  }

  productInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
