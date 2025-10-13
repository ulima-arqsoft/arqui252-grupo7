import { Routes } from '@angular/router';

import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { ProductsPageComponent } from './pages/products/products-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: DashboardPageComponent },
      { path: 'products', component: ProductsPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
