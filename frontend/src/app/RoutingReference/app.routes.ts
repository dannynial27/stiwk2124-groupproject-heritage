import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form';
import { FeedbackViewerComponent } from './components/feedback-viewer/feedback-viewer';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductComparisonComponent } from './components/product-comparison/product-comparison.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feedback', component: FeedbackFormComponent },
  { path: 'feedback-viewer', component: FeedbackViewerComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  
  // Product & Wishlist Routes
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },
  { path: 'compare', component: ProductComparisonComponent },
  
  // Admin routes
  { path: 'admin/products', component: AdminProductsComponent },
];
