import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service'; // Add missing import
import { AuthService } from '../../services/auth.service'; // Add missing import
import { Product, ProductFilter } from '../../models/product.model';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="product-list-container">
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
      gap: 20px;
      margin-top: 40px;
    }

    .page-btn {
      padding: 10px 20px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: #f8f9fa;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-weight: 500;
      color: #333;
    }

    @media (max-width: 768px) {
      .filter-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-select {
        min-width: unset;
      }

      .view-toggle {
        margin-left: 0;
        align-self: center;
      }

      .products-container.grid-view {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
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
  searchQuery = '';
  selectedCategory = '';
  sortOrder = '';
  viewMode: 'grid' | 'list' = 'grid';

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  private searchTimeout: any;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService, // Add CartService
    private authService: AuthService  // Add AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadWishlist();
  }

  loadProducts(): void {
    this.loading = true;
    
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        console.log('Received products:', products);
        // Ensure we have an array
        this.products = Array.isArray(products) ? products : [];
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.filteredProducts = [];
        this.loading = false;
      }
    });
  }

  loadWishlist() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.wishlistService.getWishlist(userId).subscribe({
        next: (wishlist) => {
          this.wishlistProductIds = new Set(
            // Add proper type annotation for item
            wishlist.items.map((item: any) => item.product.productId)
          );
        },
        error: (error) => {
          console.error('Error loading wishlist:', error);
          this.wishlistProductIds = new Set();
        }
      });
    }
  }

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
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
    if (!Array.isArray(this.products)) {
      console.warn('Products is not an array:', this.products);
      this.filteredProducts = [];
      return;
    }

    let filtered = [...this.products];

    // Apply category filter
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === this.selectedCategory!.toLowerCase()
      );
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (this.sortOrder) {
      filtered.sort((a, b) => {
        switch (this.sortOrder) {
          case 'asc':
            return a.price - b.price;
          case 'desc':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortOrder = '';
    this.applyFilters();
  }

  // Add a safe check function
  private safeProductId(product: Product): number {
    return product?.productId || 0;
  }

  onAddToCart(product: Product) {
    const productId = this.safeProductId(product);
    this.cartLoadingIds.add(productId);
    
    this.cartService.addToCart(productId, 1).subscribe({
      next: (cart: any) => {
        this.cartLoadingIds.delete(productId);
        // Show success notification
      },
      error: (err: any) => {
        this.cartLoadingIds.delete(productId);
        console.error('Failed to add to cart:', err);
      }
    });
  }

  onToggleWishlist(product: Product) {
    const productId = this.safeProductId(product);
    this.wishlistLoadingIds.add(productId);
    
    const isInWishlist = this.wishlistProductIds.has(productId);
    
    if (isInWishlist) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistProductIds.delete(productId);
          this.wishlistLoadingIds.delete(productId);
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.wishlistLoadingIds.delete(productId);
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.wishlistProductIds.add(productId);
          this.wishlistLoadingIds.delete(productId);
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.wishlistLoadingIds.delete(productId);
        }
      });
    }
  }
}