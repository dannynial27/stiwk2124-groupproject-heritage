import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, ProductFilter } from '../../models/product.model';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="product-list-container">
      <!-- Add to Cart Notification -->
      <div *ngIf="showAddToCartNotification && addedProduct" class="add-to-cart-notification">
        <div class="notification-content">
          <i class="fas fa-check-circle"></i>
          <div class="notification-text">
            <strong>'{{ addedProduct.name }}' added to your cart.</strong>
            <span>Total items in cart: {{ cartItemCount }}</span>
          </div>
        </div>
        <div class="notification-actions">
          <button class="btn btn-primary btn-sm" (click)="viewCart()">View Cart</button>
          <button class="btn-icon" (click)="dismissNotification()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <!-- Header Section -->
      <div class="header-section">
        <h1>Our Products</h1>
        <p>Discover our range of halal products</p>
      </div>

      <!-- Filters and Search Section -->
      <div class="filters-section">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            class="search-input">
        </div>

        <div class="filter-controls">
          <select 
            [(ngModel)]="selectedCategory" 
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Categories</option>
            <option value="Madu">🍯 Madu</option>
            <option value="Mee">🍜 Mee</option>
            <option value="Minuman">☕ Minuman</option>
            <option value="Rempah">🌶️ Rempah</option>
            <option value="Sos">🥫 Sos</option>
            <option value="Lain-lain">📦 Lain-lain</option>
          </select>

          <select 
            [(ngModel)]="sortOrder" 
            (ngModelChange)="onSortChange()"
            class="filter-select">
            <option value="">Sort By</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          <div class="view-toggle">
            <button 
              class="view-btn"
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'">
              Grid
            </button>
            <button 
              class="view-btn"
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'">
              List
            </button>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div class="results-info" *ngIf="!loading">
        <span>{{filteredProducts.length}} products found</span>
      </div>

      <!-- Loading State -->
      <app-loading-spinner 
        *ngIf="loading" 
        message="Loading products...">
      </app-loading-spinner>

      <!-- Products Grid/List -->
      <div 
        class="products-container"
        [class.grid-view]="viewMode === 'grid'"
        [class.list-view]="viewMode === 'list'"
        *ngIf="!loading">
        
        <app-product-card
          *ngFor="let product of paginatedProducts"
          [product]="product"
          [isAuthenticated]="isAuthenticated"
          [isInWishlist]="wishlistProductIds.has(product.productId)"
          [cartLoading]="cartLoadingIds.has(product.productId)"
          [wishlistLoading]="wishlistLoadingIds.has(product.productId)"
          (addToCart)="onAddToCart($event)"
          (toggleWishlist)="onToggleWishlist($event)">
        </app-product-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredProducts.length === 0">
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <button class="btn btn-primary" (click)="clearFilters()">
          Clear Filters
        </button>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="!loading && filteredProducts.length > itemsPerPage">
        <button 
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)">
          Previous
        </button>

        <span class="page-info">
          Page {{currentPage}} of {{totalPages}}
        </span>

        <button 
          class="page-btn"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      padding-top: 90px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .header-section h1 {
      font-size: 36px;
      color: #333;
      margin: 0 0 10px 0;
    }

    .header-section p {
      font-size: 18px;
      color: #666;
      margin: 0;
    }

    .filters-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .search-bar {
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .filter-controls {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      min-width: 150px;
    }

    .view-toggle {
      margin-left: auto;
      display: flex;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
    }

    .view-btn {
      padding: 8px 16px;
      border: none;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-btn.active {
      background: #28a745;
      color: white;
    }

    .results-info {
      margin-bottom: 20px;
      color: #666;
      font-size: 14px;
    }

    .products-container.grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .products-container.list-view {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 40px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 20px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover {
      background: #218838;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 30px;
    }

    .page-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-weight: 500;
    }

    /* Add to Cart Notification */
    .add-to-cart-notification {
      position: sticky;
      top: 80px; 
      z-index: 1051;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #e8f4ff;
      border-left: 4px solid #0d6efd;
      padding: 12px 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 15px;
      }

    .notification-content .fa-check-circle {
      color: #28a745;
      font-size: 24px;
      }

    .notification-text strong {
      display: block;
      margin-bottom: 2px;
    }
    
    .notification-text span {
      font-size: 0.9em;
      color: #666;
    }

    .notification-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      }

    .btn-icon {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 5px;
      color: #666;
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  wishlistProductIds = new Set<number>();
  cartLoadingIds = new Set<number>();
  wishlistLoadingIds = new Set<number>();

  loading = false;
  isAuthenticated = false;
  searchQuery = '';
  selectedCategory = '';
  sortOrder = '';
  viewMode: 'grid' | 'list' = 'grid';

  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  // Notification state
  showAddToCartNotification = false;
  addedProduct: Product | null = null;
  cartItemCount = 0;
  private notificationTimer: any;

  private searchTimeout: any;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadProducts();
    if (this.isAuthenticated) {
      this.loadWishlist();
      this.cartService.cartCount$.subscribe(count => {
        this.cartItemCount = count;
      });
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(data => {
      this.products = data.map(p => ({...p, quantity: 1}));
        this.applyFilters();
        this.loading = false;
    });
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        this.wishlistProductIds = new Set(
          wishlist.items.map(item => this.safeProductId(item.product))
        );
      },
      error: () => {
        this.wishlistProductIds = new Set();
      }
    });
  }

  onSearchChange() {
      clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters(): void {
    let tempProducts = [...this.products];

    // Search
    if (this.searchQuery) {
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filter
    if (this.selectedCategory) {
      tempProducts = tempProducts.filter(p => p.category === this.selectedCategory);
    }

    // Sort
    if (this.sortOrder === 'asc') {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortOrder === 'name') {
      tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProducts = tempProducts;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.goToPage(1); // Reset to first page after filtering
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortOrder = '';
    this.applyFilters();
  }

  private safeProductId(product: Product): number {
    return product ? product.productId : 0;
  }

  onAddToCart(product: Product) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/products' } });
      return;
    }
    const productId = this.safeProductId(product);
    this.cartLoadingIds.add(productId);
    
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.showNotification(product);
        this.cartLoadingIds.delete(productId);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.cartLoadingIds.delete(productId);
      }
    });
  }

  onToggleWishlist(product: Product) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/products' } });
      return;
    }
    const productId = this.safeProductId(product);
    this.wishlistLoadingIds.add(productId);
    
    if (this.wishlistProductIds.has(productId)) {
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistProductIds.delete(productId);
          this.wishlistLoadingIds.delete(productId);
        },
        error: () => this.wishlistLoadingIds.delete(productId)
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.wishlistProductIds.add(productId);
          this.wishlistLoadingIds.delete(productId);
        },
        error: () => this.wishlistLoadingIds.delete(productId)
      });
    }
  }

  // Notification Methods
  showNotification(product: Product) {
    this.addedProduct = product;
    this.showAddToCartNotification = true;

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notificationTimer = setTimeout(() => {
      this.dismissNotification();
    }, 5000); // 5-second timer
  }

  dismissNotification() {
    this.showAddToCartNotification = false;
    this.addedProduct = null;
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
  }

  viewCart() {
    this.dismissNotification();
    this.router.navigate(['/cart']);
  }
}