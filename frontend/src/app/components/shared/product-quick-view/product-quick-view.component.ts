import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ImageService } from '../../services/image.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-quick-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StarRatingComponent, LoadingSpinnerComponent, ProductCardComponent],
  template: `
    <!-- Modal Backdrop -->
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onBackdropClick()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2>Quick View</h2>
          <button class="close-btn" (click)="closeModal()" title="Close">
            <span>×</span>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content" *ngIf="product">
          <!-- Product Information Section -->
          <div class="product-section">
            <!-- Product Image -->
            <div class="product-image-section">
              <div class="main-image-container">
                <img 
                  [src]="getImageUrl(product.imagePath)"
                  [alt]="product.name"
                  class="product-image"
                  (error)="onImageError($event)">
                
                <!-- Stock Badge -->
                <div class="stock-badge" 
                     [class.in-stock]="product.stockQuantity > 5"
                     [class.low-stock]="product.stockQuantity <= 5 && product.stockQuantity > 0"
                     [class.out-of-stock]="product.stockQuantity === 0">
                  {{getStockStatus()}}
                </div>
              </div>
            </div>

            <!-- Product Details -->
            <div class="product-details-section">
              <div class="product-header">
                <span class="category-badge">{{getCategoryEmoji()}} {{product.category}}</span>
                <h3 class="product-title">{{product.name}}</h3>
                
                <!-- Rating -->
                <div class="product-rating" *ngIf="product.rating && product.rating > 0">
                  <app-star-rating 
                    [rating]="product.rating"
                    [showText]="true"
                    [reviewCount]="reviewCount">
                  </app-star-rating>
                </div>
              </div>

              <!-- Price -->
              <div class="price-section">
                <span class="current-price">RM {{product.price.toFixed(2)}}</span>
                <span class="original-price" *ngIf="originalPrice && originalPrice > product.price">
                  RM {{originalPrice.toFixed(2)}}
                </span>
                <span class="discount-badge" *ngIf="discountPercentage > 0">
                  -{{discountPercentage}}%
                </span>
              </div>

              <!-- Description -->
              <div class="description-section" *ngIf="product.description">
                <p class="product-description">{{product.description}}</p>
              </div>

              <!-- Quantity Selector -->
              <div class="quantity-section" *ngIf="product.stockQuantity > 0">
                <label class="quantity-label">Quantity:</label>
                <div class="quantity-controls">
                  <button 
                    class="qty-btn"
                    (click)="decreaseQuantity()"
                    [disabled]="quantity <= 1">
                    -
                  </button>
                  <input 
                    type="number"
                    [(ngModel)]="quantity"
                    [max]="product.stockQuantity"
                    [min]="1"
                    class="qty-input">
                  <button 
                    class="qty-btn"
                    (click)="increaseQuantity()"
                    [disabled]="quantity >= product.stockQuantity">
                    +
                  </button>
                </div>
                <span class="stock-info">{{product.stockQuantity}} available</span>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <button 
                  class="btn btn-primary btn-large"
                  (click)="onAddToCart()"
                  [disabled]="product.stockQuantity === 0 || cartLoading">
                  <span *ngIf="!cartLoading">🛒 Add to Cart</span>
                  <span *ngIf="cartLoading">Adding...</span>
                </button>

                <button 
                  class="btn btn-secondary"
                  (click)="onToggleWishlist()"
                  [disabled]="wishlistLoading">
                  <span *ngIf="!wishlistLoading">
                    {{isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}}
                  </span>
                  <span *ngIf="wishlistLoading">Processing...</span>
                </button>

                <a 
                  [routerLink]="['/products', product.productId]"
                  class="btn btn-outline"
                  (click)="closeModal()">
                  View Full Details
                </a>
              </div>

              <!-- Additional Actions -->
              <div class="additional-actions">
                <button 
                  class="action-link"
                  (click)="onCompare()">
                  ⚖️ Compare
                </button>
                <button 
                  class="action-link"
                  (click)="onShare()">
                  📤 Share
                </button>
              </div>
            </div>
          </div>

          <!-- Related Products Section -->
          <div class="related-section" *ngIf="relatedProducts.length > 0">
            <h4>You might also like</h4>
            <div class="related-products-grid">
              <app-product-card
                *ngFor="let relatedProduct of relatedProducts.slice(0, 4)"
                [product]="relatedProduct"
                [compact]="true"
                (quickView)="onRelatedProductQuickView($event)"
                (addToCart)="onRelatedAddToCart($event)"
                (toggleWishlist)="onRelatedToggleWishlist($event)">
              </app-product-card>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div class="modal-loading" *ngIf="loading">
          <app-loading-spinner message="Loading product details..."></app-loading-spinner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    .modal-container {
      background: white;
      border-radius: 16px;
      max-width: 900px;
      max-height: 90vh;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      border-bottom: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      color: #666;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: #dc3545;
      color: white;
    }

    .modal-content {
      overflow-y: auto;
      max-height: calc(90vh - 80px);
      padding: 30px;
    }

    .product-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 30px;
    }

    .product-image-section {
      position: relative;
    }

    .main-image-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: #f8f9fa;
      aspect-ratio: 1;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .stock-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .stock-badge.in-stock {
      background: #d4edda;
      color: #155724;
    }

    .stock-badge.low-stock {
      background: #fff3cd;
      color: #856404;
    }

    .stock-badge.out-of-stock {
      background: #f8d7da;
      color: #721c24;
    }

    .product-details-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .product-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .category-badge {
      background: #e9ecef;
      color: #495057;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      align-self: flex-start;
    }

    .product-title {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: 600;
      line-height: 1.3;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .current-price {
      font-size: 28px;
      font-weight: 700;
      color: #28a745;
    }

    .original-price {
      font-size: 18px;
      color: #999;
      text-decoration: line-through;
    }

    .discount-badge {
      background: #dc3545;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .product-description {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .quantity-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .quantity-label {
      font-weight: 600;
      color: #333;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      color: #333;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .qty-btn:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #28a745;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-input {
      width: 60px;
      padding: 8px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
    }

    .stock-info {
      color: #666;
      font-size: 14px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-large {
      padding: 16px 24px;
      font-size: 18px;
    }

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #218838;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #545b62;
    }

    .btn-outline {
      background: white;
      border: 2px solid #28a745;
      color: #28a745;
    }

    .btn-outline:hover:not(:disabled) {
      background: #28a745;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .additional-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .action-link {
      background: none;
      border: none;
      color: #28a745;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      text-decoration: underline;
      transition: color 0.3s ease;
    }

    .action-link:hover {
      color: #218838;
    }

    .related-section {
      border-top: 1px solid #e9ecef;
      padding-top: 30px;
    }

    .related-section h4 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
    }

    .related-products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .modal-loading {
      padding: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .modal-backdrop {
        padding: 10px;
      }

      .modal-container {
        max-height: 95vh;
      }

      .modal-content {
        padding: 20px;
      }

      .product-section {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .product-title {
        font-size: 20px;
      }

      .current-price {
        font-size: 24px;
      }

      .action-buttons {
        gap: 10px;
      }

      .related-products-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .additional-actions {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class ProductQuickViewComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen: boolean = false;
  @Input() relatedProducts: Product[] = [];
  @Input() isInWishlist: boolean = false;
  @Input() reviewCount: number = 0;

  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();
  @Output() toggleWishlist = new EventEmitter<Product>();
  @Output() compare = new EventEmitter<Product>();
  @Output() share = new EventEmitter<Product>();

  quantity = 1;
  loading = false;
  cartLoading = false;
  wishlistLoading = false;
  originalPrice?: number;
  discountPercentage = 0;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    // Listen for escape key to close modal
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.resetQuantity();
      this.calculateDiscount();
    }
    
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.style.overflow = '';
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      this.closeModal();
    }
  }

  onBackdropClick() {
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }

  resetQuantity() {
    this.quantity = 1;
  }

  calculateDiscount() {
    // This would typically come from the product data
    // For demo purposes, randomly assign some products a discount
    if (this.product && this.product.productId % 3 === 0) {
      this.originalPrice = this.product.price * 1.2;
      this.discountPercentage = Math.round(((this.originalPrice - this.product.price) / this.originalPrice) * 100);
    } else {
      this.originalPrice = undefined;
      this.discountPercentage = 0;
    }
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onAddToCart() {
    if (!this.product) return;

    this.cartLoading = true;
    this.addToCart.emit({ product: this.product, quantity: this.quantity });

    // Simulate loading
    setTimeout(() => {
      this.cartLoading = false;
    }, 1000);
  }

  onToggleWishlist() {
    if (!this.product) return;

    this.wishlistLoading = true;
    this.toggleWishlist.emit(this.product);

    // Simulate loading
    setTimeout(() => {
      this.wishlistLoading = false;
    }, 1000);
  }

  onCompare() {
    if (!this.product) return;
    this.compare.emit(this.product);
  }

  onShare() {
    if (!this.product) return;
    this.share.emit(this.product);
  }

  onRelatedProductQuickView(product: Product) {
    // Replace current product with the related product
    this.product = product;
    this.resetQuantity();
    this.calculateDiscount();
  }

  onRelatedAddToCart(product: Product) {
    this.addToCart.emit({ product, quantity: 1 });
  }

  onRelatedToggleWishlist(product: Product) {
    this.toggleWishlist.emit(product);
  }

  getImageUrl(imagePath?: string): string {
    return this.imageService.getProductImageUrl(imagePath);
  }

  onImageError(event: any) {
    event.target.src = this.imageService.getDefaultImageUrl();
  }

  getStockStatus(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) return 'Out of Stock';
    if (this.product.stockQuantity <= 5) return 'Low Stock';
    return 'In Stock';
  }

  getCategoryEmoji(): string {
    if (!this.product) return '📦';
    
    const emojiMap: { [key: string]: string } = {
      'Madu': '🍯',
      'Mee': '🍜',
      'Minuman': '☕',
      'Rempah': '🌶️',
      'Sos': '🥫',
      'Lain-lain': '📦'
    };
    return emojiMap[this.product.category] || '📦';
  }
} 