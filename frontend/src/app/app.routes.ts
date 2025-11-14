import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/components/products.component';
import { ServicesComponent } from './features/services/components/services.component';
import { CartComponent } from './features/cart/components/cart.component';
import { OrdersComponent } from './features/orders/components/orders.component';
import { UserComponent } from './features/user/components/user.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent},
  { path: 'user', component: UserComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
