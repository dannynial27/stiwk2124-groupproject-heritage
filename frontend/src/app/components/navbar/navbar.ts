import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
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
  
  @ViewChild('authDropdown') authDropdown: ElementRef | undefined;
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
        console.log('Auth state changed in navbar:', isAuth, 'Role:', this.role);
        
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
    console.log('Initial auth state in navbar:', this.isAuthenticated, 'Role:', this.role);
    
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
  
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.authDropdown?.nativeElement && !this.authDropdown.nativeElement.contains(event.target as Node)) {
      // Clicked outside the auth dropdown, so close it
      this.removeActiveFromDropdown();
    }
  }

  toggleDropdown(event: Event) {
    const toggleElement = event.currentTarget as HTMLElement;
    const parentElement = toggleElement.closest('.nav-dropdown');
    if (parentElement) {
      parentElement.classList.toggle('active');
    }
    event.stopPropagation();
  }

  private removeActiveFromDropdown() {
    if (this.authDropdown?.nativeElement) {
      this.authDropdown.nativeElement.classList.remove('active');
    }
  }

  private setupSubscriptions() {
    console.log("Setting up navbar subscriptions for user data");
    
    // Subscribe to wishlist count changes
    this.subscriptions.add(
      this.wishlistService.wishlistCount$.subscribe(count => {
        console.log('Wishlist count updated:', count);
        this.wishlistCount = count;
      })
    );

    // Subscribe to cart count changes
    this.subscriptions.add(
      this.cartService.cartCount$.subscribe(count => {
        console.log('Cart count updated:', count);
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
        next: () => console.log('Wishlist loaded successfully in navbar'),
        error: (err) => console.error('Error loading wishlist in navbar:', err)
      });
    }
  }

  loadCartData() {
    if (this.isAuthenticated) {
      this.cartService.loadCart().subscribe({
        next: () => console.log('Cart loaded successfully in navbar'),
        error: (err) => console.error('Error loading cart in navbar:', err)
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
