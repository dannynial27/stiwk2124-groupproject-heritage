import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Wishlist, WishlistItem } from '../../models/wishlist.model';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="wishlist-container">
      <div class="header-section">
        <h1>My Wishlist</h1>
        <p *ngIf="!loading && wishlist">{{wishlist.items.length}} items in your wishlist</p>
      </div>

      <app-loading-spinner 
        *ngIf="loading" 
        message="Loading wishlist...">
      </app-loading-spinner>

      <!-- Wishlist Items -->
      <div class="wishlist-content" *ngIf="!loading && wishlist">
        <!-- Action Bar -->
        <div class="action-bar" *ngIf="wishlist.items.length > 0">
          <div class="bulk-actions">
            <button 
              class="btn btn-primary"
              (click)="onMoveAllToCart()"
              [disabled]="moveAllLoading">
              <span *ngIf="!moveAllLoading">🛒 Move All to Cart</span>
              <span *ngIf="moveAllLoading">Moving...</span>
            </button>
            
            <button 
              class="btn btn-secondary"
              (click)="onShareWishlist()"
              [disabled]="shareLoading">
              <span *ngIf="!shareLoading">📤 Share Wishlist</span>
              <span *ngIf="shareLoading">Generating...</span>
            </button>
            
            <button 
              class="btn btn-outline"
              (click)="onClearWishlist()"
              [disabled]="clearingWishlist">
              <span *ngIf="!clearingWishlist">Clear All</span>
              <span *ngIf="clearingWishlist">Clearing...</span>
            </button>
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
              [isInWishlist]="true"
              [wishlistLoading]="removingIds.has(item.product.productId)"
              [cartLoading]="cartLoadingIds.has(item.product.productId)"
              (addToCart)="onAddToCart($event)"
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
  `,
  styles: [`
    .wishlist-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: 60vh;
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
      font-size: 16px;
      color: #666;
      margin: 0;
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
      display: inline-block;
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

    .btn-outline {
      background: white;
      border: 2px solid #dc3545;
      color: #dc3545;
    }

    .btn-outline:hover:not(:disabled) {
      background: #dc3545;
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
  wishlist: Wishlist | null = null;
  loading = false;
  error = false;
  clearingWishlist = false;
  viewMode: 'grid' | 'list' = 'grid';
  
  removingIds = new Set<number>();
  cartLoadingIds = new Set<number>();
  moveAllLoading = false;
  shareLoading = false;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.error = false;

    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        this.wishlist = wishlist;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onAddToCart(product: any) {
    this.cartLoadingIds.add(product.productId);
    
    this.cartService.addToCart(product.productId, 1).subscribe({
      next: () => {
        this.cartLoadingIds.delete(product.productId);
        console.log('Added to cart:', product.name);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.cartLoadingIds.delete(product.productId);
      }
    });
  }

  onMoveToCart(product: any) {
    this.cartLoadingIds.add(product.productId);
    
    // Add to cart first, then remove from wishlist
    this.cartService.addToCart(product.productId, 1).subscribe({
      next: () => {
        // Now remove from wishlist
        this.wishlistService.removeFromWishlist(product.productId).subscribe({
          next: (updatedWishlist) => {
            this.wishlist = updatedWishlist;
            this.cartLoadingIds.delete(product.productId);
            console.log('Moved to cart:', product.name);
          },
          error: (error) => {
            console.error('Error removing from wishlist:', error);
            this.cartLoadingIds.delete(product.productId);
          }
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.cartLoadingIds.delete(product.productId);
      }
    });
  }

  onRemoveFromWishlist(product: any) {
    this.removingIds.add(product.productId);

    this.wishlistService.removeFromWishlist(product.productId).subscribe({
      next: (updatedWishlist) => {
        // Update with the returned wishlist
        this.wishlist = updatedWishlist;
        this.removingIds.delete(product.productId);
        console.log('Removed from wishlist:', product.name);
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.removingIds.delete(product.productId);
      }
    });
  }

  onMoveAllToCart() {
    if (!this.wishlist || this.wishlist.items.length === 0) {
      return;
    }

    if (confirm(`Move all ${this.wishlist.items.length} items to cart?`)) {
      this.moveAllLoading = true;
      
      this.wishlistService.moveAllToCart().subscribe({
        next: (response: any) => {
          console.log('All items moved to cart:', response);
          this.loadWishlist(); // Refresh wishlist
          this.moveAllLoading = false;
          // Show success message
          alert('All items moved to cart successfully!');
        },
        error: (error: any) => {
          console.error('Error moving all to cart:', error);
          this.moveAllLoading = false;
          alert('Failed to move items to cart. Please try again.');
        }
      });
    }
  }

  onShareWishlist() {
    if (!this.wishlist || this.wishlist.items.length === 0) {
      alert('Cannot share an empty wishlist');
      return;
    }

    this.shareLoading = true;
    
    this.wishlistService.generateShareableLink().subscribe({
      next: (response: any) => {
        this.shareLoading = false;
        
        // Create a share modal or copy to clipboard
        const shareUrl = response.shareUrl;
        
        if (navigator.share) {
          // Use native share API if available
          navigator.share({
            title: 'My Wishlist',
            text: `Check out my wishlist with ${this.wishlist!.items.length} amazing products!`,
            url: shareUrl
          }).catch(console.error);
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Wishlist link copied to clipboard!');
          }).catch(() => {
            // Show the link in a prompt as fallback
            prompt('Copy this link to share your wishlist:', shareUrl);
          });
        }
      },
      error: (error: any) => {
        console.error('Error generating shareable link:', error);
        this.shareLoading = false;
        alert('Failed to generate shareable link. Please try again.');
      }
    });
  }

  onClearWishlist() {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    this.clearingWishlist = true;

    this.wishlistService.clearWishlist().subscribe({
      next: (updatedWishlist) => {
        this.wishlist = updatedWishlist;
        this.clearingWishlist = false;
        console.log('Wishlist cleared');
      },
      error: (error) => {
        console.error('Error clearing wishlist:', error);
        this.clearingWishlist = false;
      }
    });
  }

  // Handle potential undefined date in formatDate
  formatDate(dateString?: string): string {
    if (!dateString) {
      return 'Recently added';
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently added';
    }
  }
}