import { Routes } from '@angular/router';

// Home and Authentication Components
import { HomeComponent } from './components/home/home';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/register/register.component';

// Admin Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { ViewCategoriesComponent } from './components/view-categories/view-categories.component';
import { FeedbackViewerComponent } from './components/feedback-viewer/feedback-viewer';
import { AddProductComponent } from './components/add-product/add-product.component';

// Customer-facing Components
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComparisonComponent } from './components/product-comparison/product-comparison.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form';

// Order-related Components
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { MyFeedbackComponent } from './components/my-feedback/my-feedback.component';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Main public routes
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'feedback', component: FeedbackFormComponent },
  
  // Product browsing routes
  { path: 'products', component: ProductListComponent },
  { path: 'product-list', redirectTo: 'products', pathMatch: 'full' }, // Alias for backward compatibility
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'compare', component: ProductComparisonComponent },
  
  // User account routes
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'my-feedback', component: MyFeedbackComponent },
  
  // Shopping flow routes
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success/:id', component: OrderSuccessComponent },
  
  // Admin routes - grouped for clarity
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin/products', component: AdminProductsComponent },
  { path: 'product-list', component: ProductListComponent }, // Admin can view products too
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: AddProductComponent },
  { path: 'view-categories', component: ViewCategoriesComponent },
  { path: 'admin-orders', component: AdminOrdersComponent },
  { path: 'admin/orders', redirectTo: 'admin-orders', pathMatch: 'full' }, // Alias for backward compatibility
  { path: 'admin-feedback', component: FeedbackViewerComponent },
  
  // Redirects for backward compatibility
  { path: 'admin-login', redirectTo: 'login', pathMatch: 'full' },
  
  // Handle both cart components (assuming they might serve different purposes)
  // If they're duplicates, you should decide which one to keep
  { path: 'shopping-cart', redirectTo: 'cart', pathMatch: 'full' },
  
  // Wild card route for 404
  { path: '**', redirectTo: 'home' }
];
