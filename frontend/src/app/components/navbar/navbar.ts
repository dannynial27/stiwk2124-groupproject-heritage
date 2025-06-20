import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
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
  orderCount: number = 0;
  mobileMenuOpen: boolean = false;
  isAuthenticated: boolean = false; // Add this missing property
  
  @ViewChild('authDropdown') authDropdown: ElementRef | undefined;
  @ViewChild('feedbackDropdown') feedbackDropdown: ElementRef | undefined;
  @ViewChild('productsDropdown') productsDropdown: ElementRef | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private orderService: OrderService,
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
          this.orderCount = 0;
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

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as Node;
    const authClickedInside = this.authDropdown?.nativeElement.contains(target);
    const feedbackClickedInside = this.feedbackDropdown?.nativeElement.contains(target);
    const productsClickedInside = this.productsDropdown?.nativeElement.contains(target);

    if (!authClickedInside && !feedbackClickedInside && !productsClickedInside) {
      this.closeDropdowns();
    }
  }

  toggleDropdown(event: Event, dropdown: 'auth' | 'feedback' | 'products') {
    event.stopPropagation();
    const authEl = this.authDropdown?.nativeElement;
    const feedbackEl = this.feedbackDropdown?.nativeElement;
    const productsEl = this.productsDropdown?.nativeElement;

    if (dropdown === 'auth') {
      feedbackEl?.classList.remove('active');
      productsEl?.classList.remove('active');
      authEl?.classList.toggle('active');
    } else if (dropdown === 'feedback') {
      authEl?.classList.remove('active');
      productsEl?.classList.remove('active');
      feedbackEl?.classList.toggle('active');
    } else if (dropdown === 'products') {
      authEl?.classList.remove('active');
      feedbackEl?.classList.remove('active');
      productsEl?.classList.toggle('active');
    }
  }

  closeDropdowns() {
    // Don't close mobile menu when closing dropdowns
    // this.mobileMenuOpen = false; // Remove this line
    this.authDropdown?.nativeElement.classList.remove('active');
    this.feedbackDropdown?.nativeElement.classList.remove('active');
    this.productsDropdown?.nativeElement.classList.remove('active');
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

    // Subscribe to order count changes
    this.subscriptions.add(
      this.orderService.orderCount$.subscribe(count => {
        console.log('Order count updated:', count);
        this.orderCount = count;
      })
    );

    // Initialize data
    this.loadWishlistData();
    this.loadCartData();
    this.loadOrderData();
  }

  loadWishlistData() {
    if (this.isAuthenticated && this.role?.toLowerCase() === 'customer') {
      this.wishlistService.getWishlist().subscribe({
        next: () => console.log('Wishlist loaded successfully in navbar'),
        error: (err) => {
          console.error('Error loading wishlist in navbar:', err);
          // Don't show error to user, just handle it gracefully
          this.wishlistCount = 0;
        }
      });
    }
  }

  loadCartData() {
    if (this.isAuthenticated && this.role?.toLowerCase() === 'customer') {
      this.cartService.loadCart().subscribe({
        next: () => console.log('Cart loaded successfully in navbar'),
        error: (err) => {
          console.error('Error loading cart in navbar:', err);
          this.cartCount = 0;
        }
      });
    }
  }

  loadOrderData() {
    if (this.isAuthenticated) {
      const userId = this.authService.getUserId();
      if (userId) {
        this.orderService.getUserOrders(userId).subscribe({
          next: () => console.log('Orders loaded successfully in navbar'),
          error: (err) => {
            console.error('Error loading orders in navbar:', err);
            this.orderCount = 0;
          }
        });
      }
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.closeDropdowns(); // Ensure dropdowns are closed on logout
      this.router.navigate(['/login']); // Navigate to login page
    }
  }
}
