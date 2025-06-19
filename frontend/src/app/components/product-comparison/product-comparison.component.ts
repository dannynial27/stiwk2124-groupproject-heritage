import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductComparisonService, ComparisonProduct } from '../../services/product-comparison.service';
import { StarRatingComponent } from '../shared/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-product-comparison',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent],
  template: `
    <div class="comparison-container">
      <div class="comparison-header">
        <h2>Product Comparison</h2>
        <div class="header-actions">
          <span class="comparison-count">{{comparisonProducts.length}} / {{maxComparisons}} products</span>
          <button 
            class="clear-all-btn"
            (click)="clearAllComparisons()"
            *ngIf="comparisonProducts.length > 0">
            Clear All
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="comparisonProducts.length === 0">
        <div class="empty-icon">⚖️</div>
        <h3>No products to compare</h3>
        <p>Add products from the product listing or detail pages to start comparing</p>
        <a routerLink="/products" class="browse-btn">Browse Products</a>
      </div>

      <!-- Comparison Content -->
      <div class="comparison-content" *ngIf="comparisonProducts.length > 0">
        
        <!-- Comparison Analysis -->
        <div class="comparison-analysis" *ngIf="analysisData">
          <h3>Quick Analysis</h3>
          <div class="analysis-grid">
            <div class="analysis-item">
              <div class="analysis-icon">💰</div>
              <div class="analysis-content">
                <h4>Best Value</h4>
                <p>{{analysisData.bestValue?.name}}</p>
                <span class="analysis-price">RM {{analysisData.bestValue?.price}}</span>
              </div>
            </div>
            
            <div class="analysis-item">
              <div class="analysis-icon">⭐</div>
              <div class="analysis-content">
                <h4>Highest Rated</h4>
                <p>{{analysisData.highestRated?.name}}</p>
                <app-star-rating [rating]="analysisData.highestRated?.rating || 0"></app-star-rating>
              </div>
            </div>
            
            <div class="analysis-item">
              <div class="analysis-icon">💵</div>
              <div class="analysis-content">
                <h4>Lowest Price</h4>
                <p>{{analysisData.lowestPrice?.name}}</p>
                <span class="analysis-price">RM {{analysisData.lowestPrice?.price}}</span>
              </div>
            </div>
            
            <div class="analysis-item">
              <div class="analysis-icon">📊</div>
              <div class="analysis-content">
                <h4>Price Range</h4>
                <p>RM {{analysisData.priceRange.min}} - RM {{analysisData.priceRange.max}}</p>
                <span class="analysis-detail">Avg: RM {{analysisData.priceRange.average.toFixed(2)}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="comparison-table-container">
          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <!-- Product Images and Names -->
              <thead>
                <tr class="product-header">
                  <th class="feature-header">Products</th>
                  <td 
                    class="product-cell"
                    *ngFor="let product of comparisonProducts; trackBy: trackByProductId">
                    <div class="product-card">
                      <button 
                        class="remove-product-btn"
                        (click)="removeFromComparison(product.productId)"
                        title="Remove from comparison">
                        ×
                      </button>
                      <div class="product-image">
                        <img 
                          [src]="getImageUrl(product.imagePath)"
                          [alt]="product.name"
                          (error)="onImageError($event)">
                      </div>
                      <div class="product-info">
                        <h4 class="product-name">{{product.name}}</h4>
                        <div class="product-category">{{product.category}}</div>
                        <div class="product-price">RM {{product.price.toFixed(2)}}</div>
                      </div>
                    </div>
                  </td>
                  <!-- Empty slots -->
                  <td 
                    class="empty-slot"
                    *ngFor="let slot of emptySlots">
                    <div class="add-product-placeholder">
                      <div class="placeholder-icon">+</div>
                      <p>Add Product</p>
                      <a routerLink="/products" class="add-product-link">Browse Products</a>
                    </div>
                  </td>
                </tr>
              </thead>

              <tbody>
                <!-- Rating -->
                <tr class="comparison-row">
                  <th class="feature-label">Rating</th>
                  <td 
                    class="feature-value"
                    *ngFor="let product of comparisonProducts">
                    <app-star-rating 
                      [rating]="product.rating || 0"
                      [showText]="true">
                    </app-star-rating>
                  </td>
                  <td 
                    class="empty-cell"
                    *ngFor="let slot of emptySlots">
                    -
                  </td>
                </tr>

                <!-- Price -->
                <tr class="comparison-row highlight-price">
                  <th class="feature-label">Price</th>
                  <td 
                    class="feature-value price-cell"
                    *ngFor="let product of comparisonProducts"
                    [class.best-price]="isLowestPrice(product.price)">
                    <span class="price">RM {{product.price.toFixed(2)}}</span>
                    <span class="price-badge" *ngIf="isLowestPrice(product.price)">Best Price</span>
                  </td>
                  <td 
                    class="empty-cell"
                    *ngFor="let slot of emptySlots">
                    -
                  </td>
                </tr>

                <!-- Stock -->
                <tr class="comparison-row">
                  <th class="feature-label">Stock</th>
                  <td 
                    class="feature-value"
                    *ngFor="let product of comparisonProducts">
                    <span 
                      class="stock-status"
                      [class.in-stock]="product.stockQuantity > 5"
                      [class.low-stock]="product.stockQuantity <= 5 && product.stockQuantity > 0"
                      [class.out-of-stock]="product.stockQuantity === 0">
                      {{getStockStatus(product.stockQuantity)}}
                    </span>
                    <div class="stock-count" *ngIf="product.stockQuantity > 0">
                      {{product.stockQuantity}} available
                    </div>
                  </td>
                  <td 
                    class="empty-cell"
                    *ngFor="let slot of emptySlots">
                    -
                  </td>
                </tr>

                <!-- Category -->
                <tr class="comparison-row">
                  <th class="feature-label">Category</th>
                  <td 
                    class="feature-value"
                    *ngFor="let product of comparisonProducts">
                    <span class="category-badge">{{getCategoryEmoji(product.category)}} {{product.category}}</span>
                  </td>
                  <td 
                    class="empty-cell"
                    *ngFor="let slot of emptySlots">
                    -
                  </td>
                </tr>

                <!-- Description -->
                <tr class="comparison-row">
                  <th class="feature-label">Description</th>
                  <td 
                    class="feature-value description-cell"
                    *ngFor="let product of comparisonProducts">
                    <div class="description-text">
                      {{product.description || 'No description available'}}
                    </div>
                  </td>
                  <td 
                    class="empty-cell"
                    *ngFor="let slot of emptySlots">
                    -
                  </td>
                </tr>

                <!-- Actions -->
                <tr class="comparison-row actions-row">
                  <th class="feature-label">Actions</th>
                  <td 
                    class="feature-value"
                    *ngFor="let product of comparisonProducts">
                    <div class="product-actions">
                      <a 
                        [routerLink]="['/products', product.productId]"
                        class="action-btn view-btn">
                        View Details
                      </a>
                      <button 
                        class="action-btn cart-btn"
                        (click)="addToCart(product)"
                        [disabled]="product.stockQuantity === 0">
                        {{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}}
                      </button>
                      <button 
                        class="action-btn wishlist-btn"
                        (click)="toggleWishlist(product)">
                        Add to Wishlist
                      </button>
                    </div>
                  </td>
                  <td 
                    class="empty-cell"
                    *ngFor="let slot of emptySlots">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Comparison Summary -->
        <div class="comparison-summary" *ngIf="comparisonProducts.length >= 2">
          <h3>Summary</h3>
          <div class="summary-content">
            <div class="summary-item">
              <strong>Categories:</strong> {{analysisData?.categories.join(', ')}}
            </div>
            <div class="summary-item">
              <strong>Price Range:</strong> RM {{analysisData?.priceRange.min}} - RM {{analysisData?.priceRange.max}}
            </div>
            <div class="summary-item">
              <strong>Average Rating:</strong> {{(analysisData?.ratingRange.average || 0).toFixed(1)}} stars
            </div>
            <div class="summary-item">
              <strong>Total Stock:</strong> {{analysisData?.stockRange.total}} items
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comparison-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .comparison-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .comparison-header h2 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .comparison-count {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .clear-all-btn {
      padding: 8px 16px;
      border: 1px solid #dc3545;
      background: white;
      color: #dc3545;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .clear-all-btn:hover {
      background: #dc3545;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .browse-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #28a745;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .browse-btn:hover {
      background: #218838;
    }

    .comparison-analysis {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .comparison-analysis h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .analysis-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .analysis-icon {
      font-size: 24px;
      width: 40px;
      text-align: center;
    }

    .analysis-content h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    }

    .analysis-content p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 14px;
    }

    .analysis-price {
      color: #28a745;
      font-weight: 600;
    }

    .analysis-detail {
      color: #999;
      font-size: 12px;
    }

    .comparison-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      margin-bottom: 30px;
    }

    .comparison-table-wrapper {
      overflow-x: auto;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .product-header th,
    .product-header td {
      padding: 20px 15px;
      text-align: center;
      vertical-align: top;
    }

    .feature-header {
      background: #28a745;
      color: white;
      font-weight: 600;
      width: 150px;
      min-width: 150px;
    }

    .product-cell {
      background: #f8f9fa;
      position: relative;
      width: 200px;
      min-width: 200px;
    }

    .product-card {
      position: relative;
      text-align: center;
    }

    .remove-product-btn {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 24px;
      height: 24px;
      border: none;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      z-index: 2;
    }

    .product-image {
      width: 80px;
      height: 80px;
      margin: 0 auto 10px;
      border-radius: 8px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-name {
      margin: 0 0 5px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      line-height: 1.3;
    }

    .product-category {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .product-price {
      font-size: 16px;
      font-weight: 700;
      color: #28a745;
    }

    .empty-slot {
      background: #f8f9fa;
      border: 2px dashed #ddd;
      width: 200px;
      min-width: 200px;
    }

    .add-product-placeholder {
      padding: 20px;
      text-align: center;
      color: #999;
    }

    .placeholder-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .add-product-placeholder p {
      margin: 0 0 10px 0;
      font-size: 14px;
    }

    .add-product-link {
      color: #28a745;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
    }

    .comparison-row th,
    .comparison-row td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
      text-align: center;
      vertical-align: middle;
    }

    .feature-label {
      background: #f8f9fa;
      color: #333;
      font-weight: 600;
      text-align: left;
      width: 150px;
      min-width: 150px;
    }

    .feature-value {
      background: white;
      width: 200px;
      min-width: 200px;
    }

    .empty-cell {
      background: #f8f9fa;
      color: #ccc;
      width: 200px;
      min-width: 200px;
    }

    .highlight-price {
      background: rgba(40, 167, 69, 0.05);
    }

    .price-cell {
      position: relative;
    }

    .price {
      font-size: 18px;
      font-weight: 700;
      color: #28a745;
    }

    .price-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #28a745;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 12px;
      font-weight: 500;
    }

    .best-price {
      background: rgba(40, 167, 69, 0.1);
      border: 2px solid #28a745;
    }

    .stock-status {
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
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

    .stock-count {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .category-badge {
      background: #e9ecef;
      color: #495057;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .description-cell {
      max-width: 200px;
    }

    .description-text {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
      text-align: left;
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions-row {
      background: #f8f9fa;
    }

    .product-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
    }

    .view-btn {
      background: #007bff;
      color: white;
    }

    .view-btn:hover {
      background: #0056b3;
    }

    .cart-btn {
      background: #28a745;
      color: white;
    }

    .cart-btn:hover:not(:disabled) {
      background: #218838;
    }

    .cart-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .wishlist-btn {
      background: #ffc107;
      color: #212529;
    }

    .wishlist-btn:hover {
      background: #e0a800;
    }

    .comparison-summary {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .comparison-summary h3 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .summary-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .summary-item {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 14px;
    }

    .summary-item strong {
      color: #333;
    }

    @media (max-width: 768px) {
      .comparison-container {
        padding: 15px;
      }

      .comparison-header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .header-actions {
        justify-content: space-between;
      }

      .analysis-grid {
        grid-template-columns: 1fr;
      }

      .comparison-table {
        min-width: 600px;
      }

      .product-cell,
      .feature-value,
      .empty-cell {
        width: 150px;
        min-width: 150px;
      }

      .product-name {
        font-size: 12px;
      }

      .summary-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductComparisonComponent implements OnInit, OnDestroy {
  comparisonProducts: ComparisonProduct[] = [];
  analysisData: any = null;
  emptySlots: number[] = [];
  maxComparisons = 4;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private comparisonService: ProductComparisonService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.maxComparisons = this.comparisonService.getMaxComparisons();
    this.loadComparisons();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadComparisons() {
    this.subscription.add(
      this.comparisonService.getComparisonProducts().subscribe(products => {
        this.comparisonProducts = products;
        this.analysisData = this.comparisonService.getComparisonAnalysis();
        this.updateEmptySlots();
      })
    );
  }

  updateEmptySlots() {
    const emptyCount = this.maxComparisons - this.comparisonProducts.length;
    this.emptySlots = Array(Math.max(0, emptyCount)).fill(0);
  }

  removeFromComparison(productId: number) {
    if (confirm('Remove this product from comparison?')) {
      this.comparisonService.removeFromComparison(productId);
    }
  }

  clearAllComparisons() {
    if (confirm('Clear all products from comparison?')) {
      this.comparisonService.clearComparison();
    }
  }

  isLowestPrice(price: number): boolean {
    if (!this.analysisData) return false;
    return price === this.analysisData.priceRange.min;
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 5) return 'Low Stock';
    return 'In Stock';
  }

  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Madu': '🍯',
      'Mee': '🍜',
      'Minuman': '☕',
      'Rempah': '🌶️',
      'Sos': '🥫',
      'Lain-lain': '📦'
    };
    return emojiMap[category] || '📦';
  }

  getImageUrl(imagePath?: string): string {
    return this.imageService.getProductImageUrl(imagePath);
  }

  onImageError(event: any) {
    event.target.src = this.imageService.getDefaultImageUrl();
  }

  addToCart(product: ComparisonProduct) {
    console.log('Add to cart:', product);
    // Implement add to cart functionality
  }

  toggleWishlist(product: ComparisonProduct) {
    console.log('Toggle wishlist:', product);
    // Implement wishlist toggle functionality
  }

  trackByProductId(index: number, product: ComparisonProduct): number {
    return product.productId;
  }
} 