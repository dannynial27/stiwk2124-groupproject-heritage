import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
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
  { path: 'feedback', component: FeedbackFormComponent },
  { path: 'feedback-viewer', component: FeedbackViewerComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
];
