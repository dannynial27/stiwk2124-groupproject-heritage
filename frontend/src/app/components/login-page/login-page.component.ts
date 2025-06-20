import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  login(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate inputs
    if (!this.username || this.username.trim() === '') {
      this.errorMessage = 'Username is required';
      return;
    }

    if (!this.password || this.password.trim() === '') {
      this.errorMessage = 'Password is required';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful, initializing user data...');
        this.initializeUserServices();

        // Navigation based on role
        const role = localStorage.getItem('role');
        console.log(`Redirecting user with role: ${role}`);

        if (role === 'ADMIN' || role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.errorMessage = err.message || 'Invalid username or password. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  initializeUserServices(): void {
    if (this.authService.isAuthenticated()) {
      console.log('Loading user cart data...');
      this.cartService.loadCart().subscribe({
        next: (data) => console.log('Cart loaded successfully:', data),
        error: (err) => console.error('Failed to load cart:', err)
      });

      console.log('Loading user wishlist data...');
      this.wishlistService.getWishlist().subscribe({
        next: (data) => console.log('Wishlist loaded successfully:', data),
        error: (err) => console.error('Failed to load wishlist:', err)
      });
    }
  }
}

