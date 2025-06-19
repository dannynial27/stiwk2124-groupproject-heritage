import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card" [class.compact]="compact" (click)="onCardClick()">
      <div class="card-header">
        <span class="category-badge">{{getCategoryEmoji()}} {{product.category}}</span>
        <button 
          *ngIf="isAuthenticated"
          class="btn btn-icon wishlist-btn"
          [class.in-wishlist]="isInWishlist"
          (click)="onToggleWishlist(); $event.stopPropagation()"
          [disabled]="wishlistLoading"
          title="{{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}}">
          <span *ngIf="!wishlistLoading">{{isInWishlist ? '❤️' : '🤍'}}</span>
          <span *ngIf="wishlistLoading" class="spinner-small"></span>
        </button>
      </div>
      
      <div class="card-body">
        <div class="product-image">
          <img [src]="getImageUrl()" [alt]="product.name" (error)="onImageError($event)">
        </div>
        <h4 class="product-name">{{product.name}}</h4>
      </div>
      
      <div class="card-footer">
        <div class="price-and-stock">
          <span class="price">RM {{product.price.toFixed(2)}}</span>
        </div>
        
        <div class="action-buttons" *ngIf="isAuthenticated">
          <button 
            class="btn btn-primary add-to-cart-btn"
            (click)="onAddToCart(); $event.stopPropagation()"
            [disabled]="product.stockQuantity === 0 || cartLoading">
            <span *ngIf="!cartLoading">🛒 Add to Cart</span>
            <span *ngIf="cartLoading">Adding...</span>
          </button>
          
          <div class="secondary-actions">
            <a [routerLink]="['/products', product.productId]"
               (click)="$event.stopPropagation()"
               class="btn btn-outline"
               title="View product details">
              View Details
            </a>
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

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .category-badge {
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .wishlist-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .wishlist-btn.in-wishlist {
      color: #dc3545;
    }

    .card-body {
      padding: 16px;
      text-align: center;
    }

    .product-image {
      height: 150px;
      margin-bottom: 16px;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .product-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-top: auto; /* Pushes footer to the bottom */
      border-top: 1px solid #f0f0f0;
      min-height: 95px; /* Ensures consistent height */
    }

    .price-and-stock .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #28a745;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }
    
    .btn {
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-to-cart-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 16px;
    }

    .secondary-actions {
      display: flex;
      gap: 8px;
    }

    .btn-outline {
      background: white;
      border: 1px solid #ddd;
      color: #666;
      padding: 8px;
      width: auto;
      min-width: 40px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isAuthenticated: boolean = false;
  @Input() isInWishlist: boolean = false;
  @Input() cartLoading: boolean = false;
  @Input() wishlistLoading: boolean = false;
  @Input() compact = false;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();
  @Output() compare = new EventEmitter<Product>();
  @Output() cardClick = new EventEmitter<Product>();

  showQuickActions = false;

  constructor(private imageService: ImageService) {}

  getImageUrl(): string {
    return this.imageService.getProductImageUrl(this.product?.imagePath);
  }

  onImageError(event: any) {
    event.target.src = this.imageService.getProductImageUrl(undefined);
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onToggleWishlist() {
    this.toggleWishlist.emit(this.product);
  }

  onCompare() {
    this.compare.emit(this.product);
  }

  onCardClick() {
    this.cardClick.emit(this.product);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getCategoryEmoji(): string {
    const categoryEmojis: { [key: string]: string } = {
      'Electronics': '📱',
      'Fashion': '👗',
      'Home': '🏠',
      'Beauty': '💄',
      'Sports': '⚽',
      'Toys': '🧸',
      'Automotive': '🚗',
      'Books': '📚'
    };
    
    return categoryEmojis[this.product.category] || '📦';
  }
}