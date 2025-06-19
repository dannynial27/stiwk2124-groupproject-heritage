import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-bulk-cart-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bulk-actions-container">
      <div class="bulk-actions-header">
        <h3>Bulk Actions</h3>
        <span class="selected-count">{{selectedProducts.length}} items selected</span>
      </div>

      <div class="bulk-buttons">
        <button 
          class="bulk-btn add-to-cart"
          (click)="addAllToCart()"
          [disabled]="selectedProducts.length === 0 || loading"
          *ngIf="showAddToCart">
          <span class="btn-icon">🛒</span>
          Add All to Cart
        </button>

        <button 
          class="bulk-btn add-to-wishlist"
          (click)="addAllToWishlist()"
          [disabled]="selectedProducts.length === 0 || loading"
          *ngIf="showAddToWishlist">
          <span class="btn-icon">💝</span>
          Add All to Wishlist
        </button>

        <button 
          class="bulk-btn move-to-wishlist"
          (click)="moveAllToWishlist()"
          [disabled]="selectedProducts.length === 0 || loading"
          *ngIf="showMoveToWishlist">
          <span class="btn-icon">💝</span>
          Move to Wishlist
        </button>

        <button 
          class="bulk-btn remove"
          (click)="removeAll()"
          [disabled]="selectedProducts.length === 0 || loading"
          *ngIf="showRemove">
          <span class="btn-icon">🗑️</span>
          Remove All
        </button>

        <button 
          class="bulk-btn compare"
          (click)="compareSelected()"
          [disabled]="selectedProducts.length < 2 || selectedProducts.length > 4 || loading"
          *ngIf="showCompare">
          <span class="btn-icon">⚖️</span>
          Compare ({{selectedProducts.length}}/4)
        </button>
      </div>

      <div class="bulk-info" *ngIf="selectedProducts.length > 0">
        <div class="total-value">
          Total Value: <strong>RM {{calculateTotalValue() | number:'1.2-2'}}</strong>
        </div>
        <div class="product-list">
          <div class="selected-products">
            <span 
              *ngFor="let product of selectedProducts.slice(0, 3)" 
              class="product-tag">
              {{product.name}}
            </span>
            <span *ngIf="selectedProducts.length > 3" class="more-count">
              +{{selectedProducts.length - 3}} more
            </span>
          </div>
        </div>
      </div>

      <div class="loading-overlay" *ngIf="loading">
        <div class="spinner"></div>
        <span>Processing...</span>
      </div>
    </div>
  `,
  styles: [`
    .bulk-actions-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      position: relative;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .bulk-actions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .bulk-actions-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .selected-count {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .bulk-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .bulk-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      background: rgba(255,255,255,0.2);
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .bulk-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }

    .bulk-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .bulk-btn.add-to-cart:hover:not(:disabled) {
      background: rgba(52, 152, 219, 0.8);
    }

    .bulk-btn.add-to-wishlist:hover:not(:disabled),
    .bulk-btn.move-to-wishlist:hover:not(:disabled) {
      background: rgba(231, 76, 60, 0.8);
    }

    .bulk-btn.remove:hover:not(:disabled) {
      background: rgba(192, 57, 43, 0.8);
    }

    .bulk-btn.compare:hover:not(:disabled) {
      background: rgba(155, 89, 182, 0.8);
    }

    .btn-icon {
      font-size: 16px;
    }

    .bulk-info {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .total-value {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .selected-products {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .product-tag {
      background: rgba(255,255,255,0.2);
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
    }

    .more-count {
      background: rgba(255,255,255,0.3);
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      backdrop-filter: blur(2px);
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .bulk-buttons {
        flex-direction: column;
      }

      .bulk-btn {
        justify-content: center;
      }

      .bulk-actions-header {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
    }
  `]
})
export class BulkCartActionsComponent {
  @Input() selectedProducts: Product[] = [];
  @Input() showAddToCart = true;
  @Input() showAddToWishlist = true;
  @Input() showMoveToWishlist = false;
  @Input() showRemove = false;
  @Input() showCompare = true;
  
  @Output() bulkActionCompleted = new EventEmitter<string>();
  @Output() compareProducts = new EventEmitter<Product[]>();

  loading = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  calculateTotalValue(): number {
    return this.selectedProducts.reduce((total, product) => total + product.price, 0);
  }

  async addAllToCart(): Promise<void> {
    if (this.selectedProducts.length === 0) return;

    this.loading = true;
    try {
      const cartItems = this.selectedProducts.map(product => ({
        productId: product.productId,
        quantity: 1
      }));

      await this.cartService.bulkAddToCart(cartItems).toPromise();
      this.bulkActionCompleted.emit(`Added ${this.selectedProducts.length} items to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.bulkActionCompleted.emit('Error adding items to cart');
    } finally {
      this.loading = false;
    }
  }

  async addAllToWishlist(): Promise<void> {
    if (this.selectedProducts.length === 0) return;

    this.loading = true;
    try {
      const promises = this.selectedProducts.map(product =>
        this.wishlistService.addToWishlist(product.productId).toPromise()
      );

      await Promise.all(promises);
      this.bulkActionCompleted.emit(`Added ${this.selectedProducts.length} items to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      this.bulkActionCompleted.emit('Error adding items to wishlist');
    } finally {
      this.loading = false;
    }
  }

  async moveAllToWishlist(): Promise<void> {
    if (this.selectedProducts.length === 0) return;

    this.loading = true;
    try {
      // First add to wishlist, then remove from current location
      const wishlistPromises = this.selectedProducts.map(product =>
        this.wishlistService.addToWishlist(product.productId).toPromise()
      );

      await Promise.all(wishlistPromises);
      this.bulkActionCompleted.emit(`Moved ${this.selectedProducts.length} items to wishlist`);
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      this.bulkActionCompleted.emit('Error moving items to wishlist');
    } finally {
      this.loading = false;
    }
  }

  async removeAll(): Promise<void> {
    if (this.selectedProducts.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to remove ${this.selectedProducts.length} items?\n\n` +
      this.selectedProducts.map(p => p.name).join(', ')
    );

    if (!confirmed) return;

    this.loading = true;
    try {
      this.bulkActionCompleted.emit(`Removed ${this.selectedProducts.length} items`);
    } catch (error) {
      console.error('Error removing items:', error);
      this.bulkActionCompleted.emit('Error removing items');
    } finally {
      this.loading = false;
    }
  }

  compareSelected(): void {
    if (this.selectedProducts.length < 2 || this.selectedProducts.length > 4) {
      return;
    }

    this.compareProducts.emit(this.selectedProducts);
  }
} 