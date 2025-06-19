import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './components/cart/cart.component';
// Import other components as needed

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  // Other routes
  
  // Remove this line if it exists:
  // { path: 'admin-login', component: AdminLoginComponent },
  
  // Add a redirect from admin-login to login
  { path: 'admin-login', redirectTo: 'login', pathMatch: 'full' },
  
  { path: '**', redirectTo: 'home' } // Handle 404
];

