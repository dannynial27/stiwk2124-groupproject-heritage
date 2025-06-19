import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { ReviewService } from '../../services/review.service';
import { Product } from '../../models/product.model';
import { Review, ReviewRequest } from '../../models/review.model';
import { StarRatingComponent } from '../shared/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { ImageService } from '../../services/image.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StarRatingComponent, LoadingSpinnerComponent, ProductReviewsComponent],
  template: `
    <div class="product-detail-container" *ngIf="!loading && product">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a routerLink="/home">Home</a> > 
        <a routerLink="/products">Products</a> > 
        <span>{{product.name}}</span>
      </nav>

      <!-- Product Main Section -->
      <div class="product-main">
        <div class="product-image-section">
          <img 
            [src]="getImageUrl(product.imagePath)" 
            [alt]="product.name"
            class="main-image"
            (error)="onImageError($event)">
        </div>

        <div class="product-info-section">
          <h1 class="product-title">{{product.name}}</h1>
          
          <div class="product-rating" *ngIf="averageRating > 0">
            <app-star-rating 
              [rating]="averageRating" 
              [showText]="true"
              [reviewCount]="reviews.length">
            </app-star-rating>
          </div>

          <div class="product-price">
            <span class="price">RM {{product.price.toFixed(2)}}</span>
          </div>

          <div class="product-category">
            <span class="category-badge">{{product.category}}</span>
          </div>

          <div class="stock-info">
            <span 
              class="stock-status"
              [class.in-stock]="product.stockQuantity > 5"
              [class.low-stock]="product.stockQuantity <= 5 && product.stockQuantity > 0"
              [class.out-of-stock]="product.stockQuantity === 0">
              {{getStockStatus()}}
            </span>
            <span *ngIf="product.stockQuantity > 0" class="stock-count">
              ({{product.stockQuantity}} available)
            </span>
          </div>

          <div class="quantity-section" *ngIf="product.stockQuantity > 0">
            <label>Quantity:</label>
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
          </div>

          <div class="action-buttons">
            <button 
              class="btn btn-primary btn-large"
              (click)="onAddToCart()"
              [disabled]="product.stockQuantity === 0 || cartLoading">
              <span *ngIf="!cartLoading">Add to Cart</span>
              <span *ngIf="cartLoading">Adding...</span>
            </button>
            
            <button 
              class="btn btn-outline wishlist-btn"
              [class.in-wishlist]="isInWishlist"
              (click)="onToggleWishlist()"
              [disabled]="wishlistLoading">
              <span *ngIf="!wishlistLoading">
                {{isInWishlist ? '❤ Remove from Wishlist' : '🤍 Add to Wishlist'}}
              </span>
              <span *ngIf="wishlistLoading">Processing...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="product-description" *ngIf="product.description">
        <h3>Product Description</h3>
        <p>{{product.description}}</p>
      </div>

      <!-- Reviews Section -->
      <app-product-reviews 
        [productId]="product.productId"
        [canAddReview]="true">
      </app-product-reviews>

    </div>

    <app-loading-spinner 
      *ngIf="loading" 
      message="Loading product details...">
    </app-loading-spinner>

    <div class="error-state" *ngIf="error">
      <h3>Product not found</h3>
      <p>The product you're looking for doesn't exist or has been removed.</p>
      <button class="btn btn-primary" routerLink="/products">
        Browse Products
      </button>
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .breadcrumb {
      margin-bottom: 30px;
      font-size: 14px;
    }

    .breadcrumb a {
      color: #28a745;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .product-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 50px;
    }

    .product-image-section {
      display: flex;
      justify-content: center;
    }

    .main-image {
      width: 100%;
      max-width: 500px;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .product-info-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .product-title {
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .product-price .price {
      font-size: 28px;
      font-weight: 700;
      color: #28a745;
    }

    .category-badge {
      background: #28a745;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .stock-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stock-status {
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .stock-status.in-stock {
      color: #28a745;
      background: rgba(40, 167, 69, 0.1);
    }

    .stock-status.low-stock {
      color: #ffc107;
      background: rgba(255, 193, 7, 0.1);
    }

    .stock-status.out-of-stock {
      color: #dc3545;
      background: rgba(220, 53, 69, 0.1);
    }

    .quantity-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .qty-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    }

    .qty-btn:hover:not(:disabled) {
      background: #f8f9fa;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-input {
      width: 80px;
      height: 40px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 20px;
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
    }

    .btn-large {
      padding: 16px 32px;
      font-size: 18px;
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
      border: 2px solid #ddd;
      color: #333;
    }

    .btn-outline:hover {
      border-color: #28a745;
      color: #28a745;
    }

    .btn-outline.in-wishlist {
      border-color: #dc3545;
      color: #dc3545;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .product-description,
    .reviews-section,
    .related-products {
      margin-bottom: 50px;
    }

    .product-description h3,
    .reviews-section h3,
    .related-products h3 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
    }

    .add-review-form {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .rating-input,
    .comment-input {
      margin-bottom: 20px;
    }

    .rating-input label,
    .comment-input label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .review-textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      resize: vertical;
    }

    .review-item {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
    }

    .review-author {
      font-weight: 600;
      color: #333;
    }

    .review-date {
      color: #666;
      font-size: 14px;
    }

    .review-comment {
      color: #555;
      line-height: 1.6;
      margin: 0;
    }

    .no-reviews {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .related-products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .error-state {
      text-align: center;
      padding: 60px 20px;
    }

    .error-state h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .error-state p {
      color: #666;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .product-main {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .product-title {
        font-size: 24px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .related-products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  
  loading = false;
  error = false;
  cartLoading = false;
  wishlistLoading = false;
  reviewLoading = false;
  
  isInWishlist = false;
  quantity = 1;
  averageRating = 0;
  userReview: Review | null = null;
  
  newReview: ReviewRequest = {
    productId: 0,
    rating: 0,
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService,
    private imageService: ImageService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  loadProductDetails(productId: number) {
    this.loading = true;
    this.error = false;
    this.newReview.productId = productId;

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadReviews(productId);
        this.checkWishlistStatus();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadReviews(productId: number) {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
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
    
    this.cartService.addToCart(this.product.productId, this.quantity).subscribe({
      next: () => {
        this.cartLoading = false;
        console.log(`Added ${this.quantity} of ${this.product!.name} to cart`);
        // You can show a toast notification here for better UX
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.cartLoading = false;
        // You can show an error toast here
      }
    });
  }

  onToggleWishlist() {
    if (!this.product) return;
    
    this.wishlistLoading = true;
    
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.productId).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.wishlistLoading = false;
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.wishlistLoading = false;
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.product.productId).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.wishlistLoading = false;
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.wishlistLoading = false;
        }
      });
    }
  }

  onSubmitReview() {
    if (this.newReview.rating === 0 || !this.newReview.comment.trim()) {
      return;
    }
    
    this.reviewLoading = true;
    
    this.reviewService.addReview(this.newReview).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.calculateAverageRating();
        this.userReview = review;
        this.resetReviewForm();
        this.reviewLoading = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.reviewLoading = false;
      }
    });
  }

  resetReviewForm() {
    this.newReview = {
      productId: this.product?.productId || 0,
      rating: 0,
      comment: ''
    };
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  loadProduct(id: number) {
    this.loading = true;
    this.error = false;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.checkWishlistStatus();
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  checkWishlistStatus() {
    if (!this.product) return;
    
    this.wishlistService.isInWishlist(this.product.productId).subscribe({
      next: (isInWishlist: boolean) => {
        this.isInWishlist = isInWishlist;
      },
      error: (error: any) => {
        console.error('Error checking wishlist status:', error);
      }
    });
  }
}