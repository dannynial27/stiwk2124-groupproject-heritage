import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { WishlistService } from '../../services/wishlist.service';
import { Cart, CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cart-container">
      <!-- Header -->
      <div class="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <div class="cart-summary">
          <span class="item-count">{{cart.items.length}} items</span>
          <span class="total-amount">RM {{calculateTotal() | number:'1.2-2'}}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your cart...</p>
      </div>

      <!-- Empty Cart -->
      <div *ngIf="!loading && cart.items.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious halal products to get started!</p>
        <button class="btn btn-primary" routerLink="/products">
          Continue Shopping
        </button>
      </div>

      <!-- Cart Items -->
      <div *ngIf="!loading && cart.items.length > 0" class="cart-content">
        
        <!-- Bulk Actions -->
        <div class="bulk-actions" *ngIf="selectedItems.size > 0">
          <div class="selection-info">
            <span>{{selectedItems.size}} items selected</span>
          </div>
          <div class="bulk-buttons">
            <button 
              class="btn btn-outline"
              (click)="moveSelectedToWishlist()"
              [disabled]="bulkLoading">
              💝 Move to Wishlist
            </button>
            <button 
              class="btn btn-danger"
              (click)="removeSelectedItems()"
              [disabled]="bulkLoading">
              🗑️ Remove Selected
            </button>
          </div>
        </div>

        <!-- Select All -->
        <div class="select-all-section">
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              [checked]="isAllSelected()"
              [indeterminate]="isSomeSelected()"
              (change)="toggleSelectAll()">
            <span class="checkmark"></span>
            Select All Items
          </label>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items">
          <div 
            *ngFor="let item of cart.items; trackBy: trackByCartItem" 
            class="cart-item"
            [class.selected]="selectedItems.has(item.product.productId)">
            
            <!-- Item Selection -->
            <div class="item-selection">
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  [checked]="selectedItems.has(item.product.productId)"
                  (change)="toggleItemSelection(item.product.productId)">
                <span class="checkmark"></span>
              </label>
            </div>

            <!-- Product Image -->
            <div class="item-image">
              <img 
                [src]="getProductImageUrl(item.product)" 
                [alt]="item.product.name"
                (error)="onImageError($event)"
                class="product-image">
            </div>

            <!-- Product Details -->
            <div class="item-details">
              <h3 class="product-name">{{item.product.name}}</h3>
              <p class="product-description">{{item.product.description}}</p>
              <div class="product-meta">
                <span class="category">{{item.product.category}}</span>
                <span class="stock-status" 
                      [class.in-stock]="item.product.stockQuantity > 0"
                      [class.low-stock]="item.product.stockQuantity <= 5 && item.product.stockQuantity > 0"
                      [class.out-of-stock]="item.product.stockQuantity === 0">
                  {{getStockStatus(item.product)}}
                </span>
              </div>
            </div>

            <!-- Price -->
            <div class="item-price">
              <span class="unit-price">RM {{item.product.price | number:'1.2-2'}}</span>
              <span class="per-unit">per unit</span>
            </div>

            <!-- Quantity Controls -->
            <div class="quantity-controls">
              <button 
                class="qty-btn"
                (click)="decreaseQuantity(item)"
                [disabled]="item.quantity <= 1 || loadingItems.has(item.product.productId)">
                -
              </button>
              <input 
                type="number" 
                class="qty-input"
                [value]="item.quantity"
                (change)="onQuantityChange(item, $event)"
                [disabled]="loadingItems.has(item.product.productId)"
                min="1"
                [max]="item.product.stockQuantity">
              <button 
                class="qty-btn"
                (click)="increaseQuantity(item)"
                [disabled]="item.quantity >= item.product.stockQuantity || loadingItems.has(item.product.productId)">
                +
              </button>
            </div>

            <!-- Subtotal -->
            <div class="item-subtotal">
              <span class="subtotal-amount">RM {{(item.product.price * item.quantity) | number:'1.2-2'}}</span>
            </div>

            <!-- Item Actions -->
            <div class="item-actions">
              <button 
                class="action-btn wishlist-btn"
                (click)="moveToWishlist(item)"
                [disabled]="loadingItems.has(item.product.productId)"
                title="Move to Wishlist">
                💝
              </button>
              <button 
                class="action-btn remove-btn"
                (click)="removeItem(item)"
                [disabled]="loadingItems.has(item.product.productId)"
                title="Remove from Cart">
                🗑️
              </button>
            </div>

            <!-- Loading Overlay -->
            <div *ngIf="loadingItems.has(item.product.productId)" class="item-loading">
              <div class="spinner-small"></div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary-section">
          <div class="summary-card">
            <h3>Order Summary</h3>
            
            <div class="summary-row">
              <span>Subtotal ({{getTotalItems()}} items)</span>
              <span>RM {{calculateSubtotal() | number:'1.2-2'}}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span>{{getShippingCost() === 0 ? 'FREE' : 'RM ' + (getShippingCost() | number:'1.2-2')}}</span>
            </div>
            
            <div class="summary-row discount" *ngIf="getDiscountAmount() > 0">
              <span>Discount</span>
              <span>-RM {{getDiscountAmount() | number:'1.2-2'}}</span>
            </div>
            
            <hr>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>RM {{calculateTotal() | number:'1.2-2'}}</span>
            </div>

            <!-- Promo Code -->
            <div class="promo-section">
              <div class="promo-input">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  [(ngModel)]="promoCode"
                  class="promo-code-input">
                <button 
                  class="btn btn-outline"
                  (click)="applyPromoCode()"
                  [disabled]="!promoCode || promoLoading">
                  Apply
                </button>
              </div>
              <div *ngIf="promoMessage" class="promo-message" [class.success]="promoSuccess">
                {{promoMessage}}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="checkout-actions">
              <button 
                class="btn btn-outline"
                routerLink="/products">
                Continue Shopping
              </button>
              <button 
                class="btn btn-primary checkout-btn"
                (click)="proceedToCheckout()"
                [disabled]="cart.items.length === 0 || hasOutOfStockItems()">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recently Viewed -->
      <div class="recently-viewed" *ngIf="!loading">
        <h3>Recently Viewed</h3>
        <div class="recent-products">
          <!-- This would be populated by a recently viewed service -->
          <p>Recently viewed products will appear here</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .cart-header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
    }

    .cart-summary {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .item-count {
      color: #7f8c8d;
      font-size: 16px;
    }

    .total-amount {
      font-size: 24px;
      font-weight: bold;
      color: #27ae60;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-cart {
      text-align: center;
      padding: 80px 20px;
      background: #f8f9fa;
      border-radius: 12px;
      margin: 40px 0;
    }

    .empty-cart-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .empty-cart h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .empty-cart p {
      color: #7f8c8d;
      margin-bottom: 30px;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
      align-items: start;
    }

    .bulk-actions {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      grid-column: 1 / -1;
    }

    .bulk-buttons {
      display: flex;
      gap: 10px;
    }

    .select-all-section {
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: 500;
    }

    .checkbox-container input {
      margin-right: 10px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 40px 120px 1fr 100px 150px 120px 80px;
      gap: 20px;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .cart-item.selected {
      border: 2px solid #3498db;
      background: #f8f9ff;
    }

    .item-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 16px;
    }

    .product-description {
      color: #7f8c8d;
      font-size: 14px;
      margin: 0 0 10px 0;
      line-height: 1.4;
    }

    .product-meta {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .category {
      background: #ecf0f1;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #2c3e50;
    }

    .stock-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .stock-status.in-stock {
      background: #d4edda;
      color: #155724;
    }

    .stock-status.low-stock {
      background: #fff3cd;
      color: #856404;
    }

    .stock-status.out-of-stock {
      background: #f8d7da;
      color: #721c24;
    }

    .item-price {
      text-align: center;
    }

    .unit-price {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
      display: block;
    }

    .per-unit {
      font-size: 12px;
      color: #7f8c8d;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
    }

    .qty-btn {
      width: 35px;
      height: 35px;
      border: none;
      background: #f8f9fa;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .qty-btn:hover:not(:disabled) {
      background: #e9ecef;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-input {
      width: 60px;
      height: 35px;
      border: none;
      text-align: center;
      font-size: 16px;
      background: white;
    }

    .item-subtotal {
      text-align: center;
    }

    .subtotal-amount {
      font-size: 18px;
      font-weight: bold;
      color: #27ae60;
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .action-btn {
      width: 35px;
      height: 35px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .wishlist-btn {
      background: #ffeaa7;
    }

    .wishlist-btn:hover:not(:disabled) {
      background: #fdcb6e;
    }

    .remove-btn {
      background: #fab1a0;
    }

    .remove-btn:hover:not(:disabled) {
      background: #e17055;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .item-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .cart-summary-section {
      position: sticky;
      top: 20px;
    }

    .summary-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .summary-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 16px;
    }

    .summary-row.discount {
      color: #27ae60;
    }

    .summary-row.total {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin-top: 15px;
    }

    .promo-section {
      margin: 20px 0;
    }

    .promo-input {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .promo-code-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .promo-message {
      font-size: 14px;
      padding: 8px;
      border-radius: 4px;
      background: #f8d7da;
      color: #721c24;
    }

    .promo-message.success {
      background: #d4edda;
      color: #155724;
    }

    .checkout-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 25px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      text-align: center;
      display: inline-block;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-outline {
      background: transparent;
      color: #3498db;
      border: 2px solid #3498db;
    }

    .btn-outline:hover:not(:disabled) {
      background: #3498db;
      color: white;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c0392b;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .checkout-btn {
      font-size: 18px;
      padding: 15px;
      font-weight: bold;
    }

    .recently-viewed {
      margin-top: 50px;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .recently-viewed h3 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .cart-item {
        grid-template-columns: 1fr;
        gap: 15px;
        text-align: center;
      }

      .bulk-actions {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .checkout-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [] };
  loading = true;
  selectedItems = new Set<number>();
  loadingItems = new Set<number>();
  bulkLoading = false;
  
  // Promo code
  promoCode = '';
  promoLoading = false;
  promoMessage = '';
  promoSuccess = false;
  appliedPromo: any = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private imageService: ImageService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.subscribeToCartChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadCart(): void {
    this.loading = true;
    this.cartService.loadCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    });
  }

  private subscribeToCartChanges(): void {
    const cartSub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    this.subscriptions.push(cartSub);
  }

  // Image handling
  getProductImageUrl(product: Product): string {
    return this.imageService.getProductImageUrl(product.imagePath);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.imageService.getDefaultImageUrl();
    }
  }

  // Quantity management
  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stockQuantity) {
      this.updateQuantity(item, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  onQuantityChange(item: CartItem, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value);
    
    if (newQuantity >= 1 && newQuantity <= item.product.stockQuantity) {
      this.updateQuantity(item, newQuantity);
    } else {
      // Reset to current quantity if invalid
      target.value = item.quantity.toString();
    }
  }

  private updateQuantity(item: CartItem, newQuantity: number): void {
    this.loadingItems.add(item.product.productId);
    
    this.cartService.updateCartItem(item.product.productId, newQuantity).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loadingItems.delete(item.product.productId);
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.loadingItems.delete(item.product.productId);
      }
    });
  }

  // Item management
  removeItem(item: CartItem): void {
    if (confirm(`Remove ${item.product.name} from cart?`)) {
      this.loadingItems.add(item.product.productId);
      
      this.cartService.removeFromCart(item.product.productId).subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loadingItems.delete(item.product.productId);
          this.selectedItems.delete(item.product.productId);
        },
        error: (error) => {
          console.error('Error removing item:', error);
          this.loadingItems.delete(item.product.productId);
        }
      });
    }
  }

  moveToWishlist(item: CartItem): void {
    this.loadingItems.add(item.product.productId);
    
    // Add to wishlist first, then remove from cart
    this.wishlistService.addToWishlist(item.product.productId).subscribe({
      next: () => {
        this.cartService.removeFromCart(item.product.productId).subscribe({
          next: (cart) => {
            this.cart = cart;
            this.loadingItems.delete(item.product.productId);
            this.selectedItems.delete(item.product.productId);
          },
          error: (error) => {
            console.error('Error removing from cart:', error);
            this.loadingItems.delete(item.product.productId);
          }
        });
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
        this.loadingItems.delete(item.product.productId);
      }
    });
  }

  // Selection management
  toggleItemSelection(productId: number): void {
    if (this.selectedItems.has(productId)) {
      this.selectedItems.delete(productId);
    } else {
      this.selectedItems.add(productId);
    }
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedItems.clear();
    } else {
      this.cart.items.forEach(item => {
        this.selectedItems.add(item.product.productId);
      });
    }
  }

  isAllSelected(): boolean {
    return this.cart.items.length > 0 && this.selectedItems.size === this.cart.items.length;
  }

  isSomeSelected(): boolean {
    return this.selectedItems.size > 0 && this.selectedItems.size < this.cart.items.length;
  }

  // Bulk operations
  removeSelectedItems(): void {
    if (this.selectedItems.size === 0) return;
    
    const itemNames = this.cart.items
      .filter(item => this.selectedItems.has(item.product.productId))
      .map(item => item.product.name)
      .join(', ');
    
    if (confirm(`Remove ${this.selectedItems.size} items from cart?\n\n${itemNames}`)) {
      this.bulkLoading = true;
      
      const removePromises = Array.from(this.selectedItems).map(productId =>
        this.cartService.removeFromCart(productId).toPromise()
      );
      
      Promise.all(removePromises).then(() => {
        this.selectedItems.clear();
        this.bulkLoading = false;
      }).catch(error => {
        console.error('Error removing items:', error);
        this.bulkLoading = false;
      });
    }
  }

  moveSelectedToWishlist(): void {
    if (this.selectedItems.size === 0) return;
    
    this.bulkLoading = true;
    
    const movePromises = Array.from(this.selectedItems).map(productId => {
      return this.wishlistService.addToWishlist(productId).toPromise()
        .then(() => this.cartService.removeFromCart(productId).toPromise());
    });
    
    Promise.all(movePromises).then(() => {
      this.selectedItems.clear();
      this.bulkLoading = false;
    }).catch(error => {
      console.error('Error moving items to wishlist:', error);
      this.bulkLoading = false;
    });
  }

  // Calculations
  calculateSubtotal(): number {
    return this.cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  getShippingCost(): number {
    const subtotal = this.calculateSubtotal();
    return subtotal >= 100 ? 0 : 10; // Free shipping over RM100
  }

  getDiscountAmount(): number {
    if (this.appliedPromo) {
      const subtotal = this.calculateSubtotal();
      return subtotal * (this.appliedPromo.discount / 100);
    }
    return 0;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.getShippingCost() - this.getDiscountAmount();
  }

  getTotalItems(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Utility methods
  getStockStatus(product: Product): string {
    if (product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity <= 5) return `Only ${product.stockQuantity} left`;
    return 'In Stock';
  }

  hasOutOfStockItems(): boolean {
    return this.cart.items.some(item => item.product.stockQuantity === 0);
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.productId;
  }

  // Promo code
  applyPromoCode(): void {
    if (!this.promoCode.trim()) return;
    
    this.promoLoading = true;
    this.promoMessage = '';
    
    // Simulate promo code validation
    setTimeout(() => {
      const validCodes = {
        'WELCOME10': { discount: 10, message: '10% discount applied!' },
        'SAVE20': { discount: 20, message: '20% discount applied!' },
        'FREESHIP': { discount: 0, message: 'Free shipping applied!', freeShipping: true }
      };
      
      const promo = validCodes[this.promoCode.toUpperCase() as keyof typeof validCodes];
      
      if (promo) {
        this.appliedPromo = promo;
        this.promoMessage = promo.message;
        this.promoSuccess = true;
      } else {
        this.promoMessage = 'Invalid promo code';
        this.promoSuccess = false;
      }
      
      this.promoLoading = false;
    }, 1000);
  }

  // Navigation
  proceedToCheckout(): void {
    if (this.cart.items.length === 0 || this.hasOutOfStockItems()) {
      return;
    }
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' } 
      });
      return;
    }
    
    this.router.navigate(['/checkout']);
  }

  // Utility method for safe productId access
  private safeProductId(item: any): number {
    if (item && item.product) {
      return item.product.productId || 0;
    }
    return 0;
  }
}