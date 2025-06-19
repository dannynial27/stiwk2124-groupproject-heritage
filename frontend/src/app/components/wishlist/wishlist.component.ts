import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Wishlist } from '../../models/wishlist.model';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="wishlist-container">
      <div *ngIf="wishlist$ | async as wishlist; else loading">
        <div class="wishlist-header">
          <h1>My Wishlist</h1>
          <div class="header-actions">
            <button class="btn btn-danger" (click)="clearWishlist()" [disabled]="clearingWishlist || wishlist.items.length === 0">
              <i class="bi bi-trash"></i> 
              <span *ngIf="!clearingWishlist">Clear All</span>
              <span *ngIf="clearingWishlist">Clearing...</span>
            </button>
          </div>
        </div>

        <div class="header-section">
          <p>{{wishlist.items.length}} items in your wishlist</p>
        </div>

        <!-- Wishlist Items -->
        <div class="wishlist-content">
          <!-- Action Bar -->
          <div class="action-bar" *ngIf="wishlist.items.length > 0">
            <div class="bulk-actions">
            </div>
            
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

          <!-- Products Grid/List -->
          <div 
            class="products-container"
            [class.grid-view]="viewMode === 'grid'"
            [class.list-view]="viewMode === 'list'"
            *ngIf="wishlist.items.length > 0">
            
            <div class="wishlist-item" *ngFor="let item of wishlist.items">
              <app-product-card
                [product]="item.product"
                [isAuthenticated]="true"
                [isInWishlist]="true"
                [wishlistLoading]="removingIds.has(item.product.productId)"
                [cartLoading]="cartLoadingIds.has(item.product.productId)"
                (toggleWishlist)="onRemoveFromWishlist($event)">
              </app-product-card>
              
              <div class="item-actions">
                <p class="added-date">Added {{formatDate(item.addedAt)}}</p>
                <button 
                  class="btn btn-small btn-primary move-to-cart-btn"
                  (click)="onMoveToCart(item.product)"
                  [disabled]="item.product.stockQuantity === 0 || cartLoadingIds.has(item.product.productId)">
                  <span *ngIf="!cartLoadingIds.has(item.product.productId)">Move to Cart</span>
                  <span *ngIf="cartLoadingIds.has(item.product.productId)">Moving...</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-wishlist" *ngIf="wishlist.items.length === 0">
            <div class="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love to your wishlist and never lose track of them!</p>
            <button class="btn btn-primary" routerLink="/products">
              Start Shopping
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div class="error-state" *ngIf="error">
          <h3>Unable to load wishlist</h3>
          <p>Please try again later or contact support if the problem persists.</p>
          <button class="btn btn-primary" (click)="loadWishlist()">
            Try Again
          </button>
        </div>
      </div>

      <ng-template #loading>
        <app-loading-spinner 
          message="Loading wishlist...">
        </app-loading-spinner>
      </ng-template>
    </div>
  `,
  styles: [`
    .wishlist-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 90px 1rem 2rem; /* Added top padding to prevent navbar overlap */
    }

    .wishlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .wishlist-header h1 {
      font-size: 36px;
      color: #333;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 15px;
    }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .bulk-actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .view-toggle {
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

    .products-container.grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .products-container.list-view {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .wishlist-item {
      position: relative;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .wishlist-item:hover {
      transform: translateY(-2px);
    }

    .item-actions {
      padding: 16px;
      border-top: 1px solid #eee;
      background: #f8f9fa;
    }

    .added-date {
      font-size: 12px;
      color: #666;
      margin: 0 0 10px 0;
    }

    .move-to-cart-btn {
      width: 100%;
    }

    .empty-wishlist {
      text-align: center;
      padding: 80px 20px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-wishlist h3 {
      font-size: 24px;
      color: #333;
      margin: 0 0 15px 0;
    }

    .empty-wishlist p {
      font-size: 16px;
      color: #666;
      margin: 0 0 30px 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .error-state {
      text-align: center;
      padding: 60px 20px;
    }

    .error-state h3 {
      color: #dc3545;
      margin-bottom: 10px;
    }

    .error-state p {
      color: #666;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-small {
      padding: 8px 16px;
      font-size: 12px;
    }

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #218838;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-outline {
      background: white;
      border: 2px solid #6c757d;
      color: #6c757d;
    }

    .btn-outline:hover:not(:disabled) {
      background: #6c757d;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .action-bar {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .view-toggle {
        align-self: center;
      }

      .products-container.grid-view {
        grid-template-columns: 1fr;
      }

      .empty-wishlist {
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 48px;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlist$: Observable<Wishlist>;
  loading = true;
  error = false;
  clearingWishlist = false;
  viewMode: 'grid' | 'list' = 'grid';
  
  removingIds = new Set<number>();
  cartLoadingIds = new Set<number>();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.wishlist$ = this.wishlistService.wishlist$;
  }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.error = false;
    this.wishlistService.getWishlist().pipe(
      catchError(err => {
        console.error('Error loading wishlist:', err);
        this.error = true;
        return of({ items: [], totalItems: 0 });
      })
    ).subscribe(() => {
      this.loading = false;
    });
  }

  onMoveToCart(product: Product) {
    this.cartLoadingIds.add(product.productId);
    this.cartService.addToCart(product.productId, 1).subscribe({
      next: () => {
        this.wishlistService.removeFromWishlist(product.productId).subscribe({
          next: () => this.cartLoadingIds.delete(product.productId),
          error: (err) => {
            console.error('Error removing from wishlist:', err);
            this.cartLoadingIds.delete(product.productId);
          }
        });
      },
      error: (err) => {
        console.error('Error moving to cart:', err);
        this.cartLoadingIds.delete(product.productId);
      }
    });
  }

  onRemoveFromWishlist(product: Product) {
    this.removingIds.add(product.productId);
    this.wishlistService.removeFromWishlist(product.productId).subscribe({
      next: () => this.removingIds.delete(product.productId),
      error: (err) => {
        console.error('Error removing from wishlist:', err);
        this.removingIds.delete(product.productId);
      }
    });
  }

  clearWishlist(): void {
    const userId = this.authService.getUserId();
    if (userId && confirm('Are you sure you want to clear your entire wishlist?')) {
      this.clearingWishlist = true;
      this.wishlistService.clearWishlist().subscribe({
        next: () => this.clearingWishlist = false,
        error: () => this.clearingWishlist = false
      });
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Recently added';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Recently added';
    }
  }
}