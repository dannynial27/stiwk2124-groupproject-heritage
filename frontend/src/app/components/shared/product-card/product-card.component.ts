import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { WishlistService } from '../../../services/wishlist.service';
import { CartService } from '../../../services/cart.service';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent],
  template: `
    <div class="product-card">
      <div class="product-image-container">
        <img 
          [src]="getImageUrl()" 
          [alt]="product.name"
          class="product-image"
          (error)="onImageError($event)">
        
        <div class="product-badges">
          <span class="category-badge">{{product.category}}</span>
          <span *ngIf="product.stockQuantity <= 5 && product.stockQuantity > 0" 
                class="stock-badge low-stock">
            Low Stock
          </span>
          <span *ngIf="product.stockQuantity === 0" class="stock-badge out-of-stock">
            Out of Stock
          </span>
        </div>
        
        <button 
          class="wishlist-btn"
          [class.in-wishlist]="isInWishlist"
          (click)="onWishlistToggle()"
          [disabled]="wishlistLoading">
          ❤
        </button>
      </div>
      
      <div class="product-info">
        <h3 class="product-name" [routerLink]="['/products', product.productId]">
          {{product.name}}
        </h3>
        
        <p class="product-description">
          {{truncateText(product.description, 80)}}
        </p>
        
        <div class="product-rating" *ngIf="averageRating > 0">
          <app-star-rating 
            [rating]="averageRating" 
            [showText]="true"
            [reviewCount]="reviewCount">
          </app-star-rating>
        </div>
        
        <div class="product-footer">
          <div class="price-section">
            <span class="price">RM {{product.price.toFixed(2)}}</span>
          </div>
          
          <div class="action-buttons">
            <button 
              class="btn btn-primary add-to-cart-btn"
              (click)="onAddToCart()"
              [disabled]="product.stockQuantity === 0 || cartLoading">
              <span *ngIf="!cartLoading">🛒 Add to Cart</span>
              <span *ngIf="cartLoading">Adding...</span>
            </button>
            
            <div class="secondary-actions">
              <button 
                class="btn btn-outline quick-view-btn"
                (click)="onQuickView(); $event.stopPropagation()"
                title="Quick View">
                ⚡
              </button>
              
              <button 
                class="btn btn-outline compare-btn"
                (click)="onCompare(); $event.stopPropagation()"
                title="Add to Compare">
                ⚖️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .product-card:hover {
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    
    .product-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    
    .product-badges {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .category-badge {
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .stock-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .low-stock {
      background: #ffc107;
      color: #856404;
    }
    
    .out-of-stock {
      background: #dc3545;
      color: white;
    }
    
    .wishlist-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .wishlist-btn:hover {
      background: white;
      transform: scale(1.1);
    }
    
    .wishlist-btn.in-wishlist {
      color: #dc3545;
      background: rgba(220, 53, 69, 0.1);
    }
    
    .product-info {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .product-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #333;
      cursor: pointer;
      transition: color 0.3s ease;
    }
    
    .product-name:hover {
      color: #28a745;
    }
    
    .product-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }
    
    .product-rating {
      margin-bottom: 12px;
    }
    
    .product-footer {
      margin-top: auto;
    }
    
    .price-section {
      margin-bottom: 12px;
    }
    
    .price {
      font-size: 20px;
      font-weight: 700;
      color: #28a745;
    }
    
    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }
    
    .btn-primary {
      background: #28a745;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #218838;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .secondary-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .btn-outline {
      background: white;
      border: 1px solid #ddd;
      color: #666;
      padding: 8px;
      width: auto;
      min-width: 40px;
      flex: 1;
    }

    .btn-outline:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #28a745;
      color: #28a745;
    }

    .quick-view-btn:hover:not(:disabled) {
      border-color: #007bff;
      color: #007bff;
    }

    .compare-btn:hover:not(:disabled) {
      border-color: #ffc107;
      color: #ffc107;
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() isInWishlist: boolean = false;
  @Input() averageRating: number = 0;
  @Input() reviewCount: number = 0;
  @Input() cartLoading: boolean = false;
  @Input() wishlistLoading: boolean = false;
  
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();
  @Output() quickView = new EventEmitter<Product>();
  @Output() compare = new EventEmitter<Product>();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit() {}

  getImageUrl(): string {
    if (!this.product) {
      return this.imageService.getDefaultImageUrl();
    }
    
    return this.imageService.getProductImageUrl(this.product.imagePath);
  }

  onImageError(event: any) {
    event.target.src = this.imageService.getDefaultImageUrl();
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onWishlistToggle() {
    this.toggleWishlist.emit(this.product);
  }

  onQuickView() {
    this.quickView.emit(this.product);
  }

  onCompare() {
    this.compare.emit(this.product);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}