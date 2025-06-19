import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ViewCategoriesComponent } from './components/view-categories/view-categories.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form';
import { FeedbackViewerComponent } from './components/feedback-viewer/feedback-viewer';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component'
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: AddProductComponent },
  { path: 'categories', component: ViewCategoriesComponent },
  { path: 'feedback', component: FeedbackFormComponent },
  { path: 'feedback-viewer', component: FeedbackViewerComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success/:id', component: OrderSuccessComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'admin-orders', component: AdminOrdersComponent },
  { path: 'admin-login', redirectTo: 'login', pathMatch: 'full' },
  // Catch all route - must be last
  { path: '**', redirectTo: '/home' }
];
