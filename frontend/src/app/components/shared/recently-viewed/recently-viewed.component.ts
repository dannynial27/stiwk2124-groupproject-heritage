import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecentlyViewedService, RecentlyViewedItem } from '../../../services/recently-viewed.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-recently-viewed',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="recently-viewed-container" *ngIf="recentlyViewed.length > 0">
      <div class="section-header">
        <h3>Recently Viewed</h3>
        <div class="header-actions">
          <button 
            class="view-all-btn"
            (click)="showAllRecent = !showAllRecent">
            {{showAllRecent ? 'Show Less' : 'View All'}}
          </button>
          <button 
            class="clear-btn"
            (click)="clearAllRecentlyViewed()"
            title="Clear all recently viewed products">
            Clear All
          </button>
        </div>
      </div>

      <!-- Horizontal Scroll View -->
      <div class="products-scroll-container" *ngIf="!showAllRecent">
        <div class="scroll-wrapper">
          <button 
            class="scroll-btn scroll-left"
            (click)="scrollLeft()"
            [disabled]="scrollPosition <= 0">
            ‹
          </button>

          <div class="products-scroll" #scrollContainer>
            <div class="products-track" [style.transform]="'translateX(' + scrollPosition + 'px)'">
              <div 
                class="recent-product-item"
                *ngFor="let item of displayedItems; trackBy: trackByProductId">
                <div class="product-wrapper">
                  <app-product-card
                    [product]="item.product"
                    [showQuickActions]="true"
                    (addToCart)="onAddToCart($event)"
                    (toggleWishlist)="onToggleWishlist($event)">
                  </app-product-card>
                  
                  <div class="recently-viewed-info">
                    <span class="view-count">👁 {{item.viewCount}} views</span>
                    <span class="view-date">{{formatDate(item.viewedAt)}}</span>
                    <button 
                      class="remove-btn"
                      (click)="removeFromRecentlyViewed(item.product.productId)"
                      title="Remove from recently viewed">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            class="scroll-btn scroll-right"
            (click)="scrollRight()"
            [disabled]="scrollPosition <= -(maxScrollPosition)">
            ›
          </button>
        </div>
      </div>

      <!-- Grid View (Show All) -->
      <div class="products-grid-container" *ngIf="showAllRecent">
        <div class="products-grid">
          <div 
            class="recent-product-item"
            *ngFor="let item of recentlyViewed; trackBy: trackByProductId">
            <div class="product-wrapper">
              <app-product-card
                [product]="item.product"
                [showQuickActions]="true"
                (addToCart)="onAddToCart($event)"
                (toggleWishlist)="onToggleWishlist($event)">
              </app-product-card>
              
              <div class="recently-viewed-info">
                <div class="view-stats">
                  <span class="view-count">👁 {{item.viewCount}} views</span>
                  <span class="view-date">{{formatDate(item.viewedAt)}}</span>
                </div>
                <button 
                  class="remove-btn"
                  (click)="removeFromRecentlyViewed(item.product.productId)"
                  title="Remove from recently viewed">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="recentlyViewed.length === 0">
        <div class="empty-icon">👁</div>
        <h4>No recently viewed products</h4>
        <p>Products you view will appear here for easy access</p>
        <a routerLink="/products" class="browse-btn">Browse Products</a>
      </div>
    </div>

    <!-- Floating Recently Viewed Button (when collapsed) -->
    <div class="floating-recent-btn" 
         *ngIf="!showSection && recentlyViewed.length > 0"
         (click)="showSection = true">
      <span class="recent-icon">👁</span>
      <span class="recent-count">{{recentlyViewed.length}}</span>
    </div>
  `,
  styles: [`
    .recently-viewed-container {
      margin: 30px 0;
      padding: 25px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .view-all-btn {
      padding: 8px 16px;
      border: 1px solid #28a745;
      background: white;
      color: #28a745;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .view-all-btn:hover {
      background: #28a745;
      color: white;
    }

    .clear-btn {
      padding: 8px 16px;
      border: 1px solid #dc3545;
      background: white;
      color: #dc3545;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .clear-btn:hover {
      background: #dc3545;
      color: white;
    }

    .products-scroll-container {
      position: relative;
    }

    .scroll-wrapper {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .scroll-btn {
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 50%;
      background: white;
      color: #666;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .scroll-btn:hover:not(:disabled) {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .scroll-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .products-scroll {
      flex: 1;
      overflow: hidden;
    }

    .products-track {
      display: flex;
      gap: 20px;
      transition: transform 0.3s ease;
    }

    .recent-product-item {
      flex: 0 0 280px;
      position: relative;
    }

    .product-wrapper {
      position: relative;
    }

    .recently-viewed-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 12px;
      color: #666;
    }

    .view-count {
      font-weight: 500;
    }

    .view-date {
      color: #999;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .remove-btn:hover {
      background: #dc3545;
      color: white;
    }

    .products-grid-container {
      margin-top: 20px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .products-grid .recently-viewed-info {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }

    .view-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .products-grid .remove-btn {
      align-self: flex-end;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid #dc3545;
      background: white;
      width: auto;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .empty-state h4 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 20px;
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

    .floating-recent-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #28a745;
      color: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .floating-recent-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
    }

    .recent-icon {
      font-size: 18px;
      margin-bottom: 2px;
    }

    .recent-count {
      font-size: 10px;
      font-weight: bold;
      background: #dc3545;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      min-width: 16px;
      text-align: center;
      position: absolute;
      top: -2px;
      right: -2px;
    }

    @media (max-width: 768px) {
      .recently-viewed-container {
        padding: 20px;
        margin: 20px 0;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .scroll-wrapper {
        gap: 10px;
      }

      .scroll-btn {
        width: 35px;
        height: 35px;
        font-size: 16px;
      }

      .recent-product-item {
        flex: 0 0 250px;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
      }

      .floating-recent-btn {
        width: 50px;
        height: 50px;
        bottom: 15px;
        right: 15px;
      }

      .recent-icon {
        font-size: 16px;
      }

      .recent-count {
        font-size: 9px;
      }
    }

    @media (max-width: 480px) {
      .recent-product-item {
        flex: 0 0 220px;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      .recently-viewed-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }
  `]
})
export class RecentlyViewedComponent implements OnInit, OnDestroy {
  @Input() maxItems: number = 8;
  @Input() showSection: boolean = true;
  @Input() itemWidth: number = 300; // Including gap

  recentlyViewed: RecentlyViewedItem[] = [];
  displayedItems: RecentlyViewedItem[] = [];
  showAllRecent = false;
  
  // Scroll properties
  scrollPosition = 0;
  maxScrollPosition = 0;
  
  private subscription: Subscription = new Subscription();

  constructor(private recentlyViewedService: RecentlyViewedService) {}

  ngOnInit() {
    this.loadRecentlyViewed();
    this.calculateScrollLimits();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadRecentlyViewed() {
    this.subscription.add(
      this.recentlyViewedService.getRecentlyViewed().subscribe(items => {
        this.recentlyViewed = items;
        this.displayedItems = items.slice(0, this.maxItems);
        this.calculateScrollLimits();
      })
    );
  }

  calculateScrollLimits() {
    const visibleItems = Math.floor(window.innerWidth / this.itemWidth);
    this.maxScrollPosition = Math.max(0, (this.displayedItems.length - visibleItems) * this.itemWidth);
  }

  scrollLeft() {
    this.scrollPosition = Math.min(0, this.scrollPosition + this.itemWidth);
  }

  scrollRight() {
    this.scrollPosition = Math.max(-this.maxScrollPosition, this.scrollPosition - this.itemWidth);
  }

  removeFromRecentlyViewed(productId: number) {
    if (confirm('Remove this product from recently viewed?')) {
      this.recentlyViewedService.removeProduct(productId);
    }
  }

  clearAllRecentlyViewed() {
    if (confirm('Clear all recently viewed products?')) {
      this.recentlyViewedService.clearAll();
      this.scrollPosition = 0;
    }
  }

  onAddToCart(product: any) {
    console.log('Add to cart:', product);
    // Handle add to cart functionality
  }

  onToggleWishlist(product: any) {
    console.log('Toggle wishlist:', product);
    // Handle wishlist toggle functionality
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  trackByProductId(index: number, item: RecentlyViewedItem): number {
    return item.product.productId;
  }
} 