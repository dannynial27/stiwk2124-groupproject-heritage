import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  role: string | null = null;
  wishlistCount: number = 0;
  cartCount: number = 0;
  mobileMenuOpen: boolean = false;
  isAuthenticated: boolean = false; // Add this missing property
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.subscriptions.add(
      this.authService.authState$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        this.role = this.authService.getRole();
        
        if (isAuth) {
          // Load counts if authenticated
          this.setupSubscriptions();
        } else {
          // Reset counts if not authenticated
          this.wishlistCount = 0;
          this.cartCount = 0;
        }
      })
    );
    
    // Initial check
    this.isAuthenticated = this.authService.isAuthenticated();
    this.role = this.authService.getRole();
    
    if (this.isAuthenticated) {
      this.setupSubscriptions();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    // Close the mobile menu when clicking outside of it
    if (this.mobileMenuOpen && !(event.target as Element).closest('.navbar-nav') && 
        !(event.target as Element).closest('.menu-toggle')) {
      this.mobileMenuOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    const toggleElement = event.currentTarget as HTMLElement;
    toggleElement.classList.toggle('active');
    event.stopPropagation();
  }

  private setupSubscriptions() {
    // Subscribe to wishlist count changes
    this.subscriptions.add(
      this.wishlistService.wishlistCount$.subscribe(count => {
        this.wishlistCount = count;
      })
    );

    // Subscribe to cart count changes
    this.subscriptions.add(
      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      })
    );

    // Initialize data
    this.loadWishlistData();
    this.loadCartData();
  }

  loadWishlistData() {
    if (this.isAuthenticated) {
      this.wishlistService.getWishlist().subscribe({
        next: () => console.log('Wishlist loaded successfully'),
        error: (err) => console.error('Error loading wishlist:', err)
      });
    }
  }

  loadCartData() {
    if (this.isAuthenticated) {
      this.cartService.loadCart().subscribe({
        next: () => console.log('Cart loaded successfully'),
        error: (err) => console.error('Error loading cart:', err)
      });
    }
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.role = null;
    this.cartCount = 0;
    this.wishlistCount = 0;
    this.isAuthenticated = false; // Update the isAuthenticated state
    this.router.navigate(['/login']);
    this.mobileMenuOpen = false;
  }
}
