import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="related-products-container" *ngIf="relatedProducts.length > 0 || loading">
      <div class="section-header">
        <h3>You Might Also Like</h3>
        <div class="view-controls">
          <button 
            class="view-btn"
            [class.active]="currentView === 'similar'"
            (click)="changeView('similar')">
            Similar Products
          </button>
          <button 
            class="view-btn"
            [class.active]="currentView === 'category'"
            (click)="changeView('category')">
            Same Category
          </button>
          <button 
            class="view-btn"
            [class.active]="currentView === 'popular'"
            (click)="changeView('popular')">
            Popular
          </button>
        </div>
      </div>

      <div class="products-section" *ngIf="!loading">
        <!-- Navigation Arrows -->
        <button 
          class="nav-arrow nav-arrow-left"
          [disabled]="currentIndex === 0"
          (click)="scrollLeft()"
          *ngIf="relatedProducts.length > productsPerView">
          ‹
        </button>

        <div class="products-carousel" #carousel>
          <div class="products-grid" [style.transform]="'translateX(' + translateX + 'px)'">
            <app-product-card
              *ngFor="let product of relatedProducts; trackBy: trackByProductId"
              [product]="product"
              [showQuickView]="true"
              [showCompare]="true"
              (addToCart)="onAddToCart($event)"
              (toggleWishlist)="onToggleWishlist($event)"
              (quickView)="onQuickView($event)"
              (compare)="onCompare($event)"
              class="product-item">
            </app-product-card>
          </div>
        </div>

        <button 
          class="nav-arrow nav-arrow-right"
          [disabled]="currentIndex >= maxIndex"
          (click)="scrollRight()"
          *ngIf="relatedProducts.length > productsPerView">
          ›
        </button>
      </div>

      <!-- Dots Indicator -->
      <div class="carousel-dots" *ngIf="relatedProducts.length > productsPerView && !loading">
        <button 
          class="dot"
          *ngFor="let dot of dots; let i = index"
          [class.active]="i === currentDotIndex"
          (click)="goToSlide(i)">
        </button>
      </div>

      <!-- View All Link -->
      <div class="view-all-section" *ngIf="relatedProducts.length > 0">
        <a 
          [routerLink]="['/products']" 
          [queryParams]="getViewAllParams()"
          class="view-all-link">
          View All {{getViewAllText()}} →
        </a>
      </div>

      <app-loading-spinner 
        *ngIf="loading" 
        message="Loading recommendations...">
      </app-loading-spinner>
    </div>

    <!-- Empty State -->
    <div class="no-recommendations" *ngIf="!loading && relatedProducts.length === 0">
      <div class="empty-icon">🔍</div>
      <p>No related products found</p>
      <a routerLink="/products" class="browse-link">Browse All Products</a>
    </div>
  `,
  styles: [`
    .related-products-container {
      margin: 40px 0;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: 600;
    }

    .view-controls {
      display: flex;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 4px;
      gap: 2px;
    }

    .view-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      color: #666;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
    }

    .view-btn:hover {
      background: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }

    .view-btn.active {
      background: #28a745;
      color: white;
    }

    .products-section {
      position: relative;
      overflow: hidden;
    }

    .products-carousel {
      overflow: hidden;
      margin: 0 50px;
    }

    .products-grid {
      display: flex;
      gap: 20px;
      transition: transform 0.3s ease;
    }

    .product-item {
      flex: 0 0 calc(25% - 15px);
      min-width: 280px;
    }

    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      z-index: 2;
    }

    .nav-arrow:hover:not(:disabled) {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .nav-arrow:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-arrow-left {
      left: 10px;
    }

    .nav-arrow-right {
      right: 10px;
    }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: none;
      background: #ddd;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot.active {
      background: #28a745;
      transform: scale(1.2);
    }

    .view-all-section {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .view-all-link {
      color: #28a745;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: color 0.3s ease;
    }

    .view-all-link:hover {
      color: #218838;
      text-decoration: underline;
    }

    .no-recommendations {
      text-align: center;
      padding: 60px 20px;
      background: #f8f9fa;
      border-radius: 12px;
      margin: 40px 0;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .no-recommendations p {
      color: #666;
      margin-bottom: 20px;
      font-size: 16px;
    }

    .browse-link {
      color: #28a745;
      text-decoration: none;
      font-weight: 600;
      padding: 10px 20px;
      border: 2px solid #28a745;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .browse-link:hover {
      background: #28a745;
      color: white;
    }

    @media (max-width: 1200px) {
      .product-item {
        flex: 0 0 calc(33.333% - 15px);
      }
    }

    @media (max-width: 768px) {
      .related-products-container {
        padding: 20px;
        margin: 20px 0;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
      }

      .view-controls {
        justify-content: center;
      }

      .products-carousel {
        margin: 0 20px;
      }

      .product-item {
        flex: 0 0 calc(50% - 10px);
        min-width: 250px;
      }

      .nav-arrow {
        width: 35px;
        height: 35px;
        font-size: 16px;
      }

      .nav-arrow-left {
        left: 5px;
      }

      .nav-arrow-right {
        right: 5px;
      }
    }

    @media (max-width: 480px) {
      .product-item {
        flex: 0 0 calc(100% - 10px);
        min-width: 200px;
      }

      .section-header h3 {
        font-size: 20px;
      }

      .view-controls {
        flex-wrap: wrap;
      }

      .view-btn {
        flex: 1;
        min-width: calc(50% - 10px);
      }
    }
  `]
})
export class RelatedProductsComponent implements OnInit, OnChanges {
  @Input() currentProduct!: Product;
  @Input() maxProducts: number = 8;

  relatedProducts: Product[] = [];
  loading = false;
  currentView: 'similar' | 'category' | 'popular' = 'similar';
  
  // Carousel properties
  currentIndex = 0;
  translateX = 0;
  productsPerView = 4;
  itemWidth = 300; // Including gap
  maxIndex = 0;
  dots: number[] = [];
  currentDotIndex = 0;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.calculateCarouselProperties();
    this.loadRelatedProducts();
    this.handleResize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentProduct'] && this.currentProduct) {
      this.loadRelatedProducts();
    }
  }

  calculateCarouselProperties() {
    // Calculate based on screen size
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
      this.productsPerView = 1;
    } else if (screenWidth < 768) {
      this.productsPerView = 2;
    } else if (screenWidth < 1200) {
      this.productsPerView = 3;
    } else {
      this.productsPerView = 4;
    }
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.calculateCarouselProperties();
      this.updateCarousel();
    });
  }

  loadRelatedProducts() {
    if (!this.currentProduct) return;

    this.loading = true;
    
    switch (this.currentView) {
      case 'similar':
        this.loadSimilarProducts();
        break;
      case 'category':
        this.loadCategoryProducts();
        break;
      case 'popular':
        this.loadPopularProducts();
        break;
    }
  }

  loadSimilarProducts() {
    // In a real app, this would use ML/AI for recommendations
    // For now, use category + price range + rating
    this.productService.getProducts().subscribe({
      next: (products) => {
        const similar = products
          .filter(p => p.productId !== this.currentProduct.productId)
          .filter(p => {
            // Same category
            const sameCategory = p.category === this.currentProduct.category;
            // Similar price range (±30%)
            const priceRange = this.currentProduct.price * 0.3;
            const similarPrice = Math.abs(p.price - this.currentProduct.price) <= priceRange;
            return sameCategory || similarPrice;
          })
          .sort((a, b) => {
            // Sort by similarity score (category + price proximity)
            const aScore = this.calculateSimilarityScore(a);
            const bScore = this.calculateSimilarityScore(b);
            return bScore - aScore;
          })
          .slice(0, this.maxProducts);

        this.relatedProducts = similar;
        this.updateCarousel();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading similar products:', error);
        this.loading = false;
      }
    });
  }

  loadCategoryProducts() {
    this.productService.getProductsByCategory(this.currentProduct.category).subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.productId !== this.currentProduct.productId)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, this.maxProducts);
        this.updateCarousel();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category products:', error);
        this.loading = false;
      }
    });
  }

  loadPopularProducts() {
    this.productService.getPopularProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.productId !== this.currentProduct.productId)
          .slice(0, this.maxProducts);
        this.updateCarousel();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading popular products:', error);
        this.loading = false;
      }
    });
  }

  calculateSimilarityScore(product: Product): number {
    let score = 0;
    
    // Category match (highest weight)
    if (product.category === this.currentProduct.category) {
      score += 10;
    }
    
    // Price proximity
    const priceDiff = Math.abs(product.price - this.currentProduct.price);
    const maxPrice = Math.max(product.price, this.currentProduct.price);
    const priceScore = Math.max(0, 5 - (priceDiff / maxPrice) * 5);
    score += priceScore;
    
    // Rating proximity
    const currentRating = this.currentProduct.rating || 0;
    const productRating = product.rating || 0;
    const ratingDiff = Math.abs(productRating - currentRating);
    const ratingScore = Math.max(0, 3 - ratingDiff);
    score += ratingScore;
    
    return score;
  }

  changeView(view: 'similar' | 'category' | 'popular') {
    if (view !== this.currentView) {
      this.currentView = view;
      this.currentIndex = 0;
      this.translateX = 0;
      this.loadRelatedProducts();
    }
  }

  updateCarousel() {
    this.maxIndex = Math.max(0, this.relatedProducts.length - this.productsPerView);
    this.dots = Array(Math.ceil(this.relatedProducts.length / this.productsPerView)).fill(0);
    this.currentDotIndex = Math.floor(this.currentIndex / this.productsPerView);
  }

  scrollLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.translateX += this.itemWidth;
      this.currentDotIndex = Math.floor(this.currentIndex / this.productsPerView);
    }
  }

  scrollRight() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.translateX -= this.itemWidth;
      this.currentDotIndex = Math.floor(this.currentIndex / this.productsPerView);
    }
  }

  goToSlide(dotIndex: number) {
    const newIndex = dotIndex * this.productsPerView;
    this.currentIndex = Math.min(newIndex, this.maxIndex);
    this.translateX = -this.currentIndex * this.itemWidth;
    this.currentDotIndex = dotIndex;
  }

  onAddToCart(product: Product) {
    console.log('Add to cart:', product);
    // Handle add to cart
  }

  onToggleWishlist(product: Product) {
    console.log('Toggle wishlist:', product);
    // Handle wishlist toggle
  }

  onQuickView(product: Product) {
    console.log('Quick view:', product);
    // Handle quick view modal
  }

  onCompare(product: Product) {
    console.log('Compare:', product);
    // Handle product comparison
  }

  getViewAllParams() {
    switch (this.currentView) {
      case 'category':
        return { category: this.currentProduct.category };
      case 'popular':
        return { sort: 'popular' };
      default:
        return {};
    }
  }

  getViewAllText(): string {
    switch (this.currentView) {
      case 'similar':
        return 'Similar Products';
      case 'category':
        return `${this.currentProduct.category} Products`;
      case 'popular':
        return 'Popular Products';
      default:
        return 'Products';
    }
  }

  trackByProductId(index: number, product: Product): number {
    return product.productId;
  }
} 