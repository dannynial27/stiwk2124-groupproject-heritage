import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { Review, ReviewRequest, ReviewSummary } from '../../models/review.model';
import { StarRatingComponent } from '../shared/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent, LoadingSpinnerComponent],
  template: `
    <div class="reviews-container">
      <!-- Reviews Summary -->
      <div class="reviews-summary" *ngIf="reviewSummary && reviews.length > 0">
        <h3>Customer Reviews</h3>
        
        <div class="summary-content">
          <div class="average-rating-section">
            <div class="average-score">
              <span class="score">{{reviewSummary.averageRating.toFixed(1)}}</span>
              <app-star-rating 
                [rating]="reviewSummary.averageRating"
                [showText]="false">
              </app-star-rating>
              <span class="total-reviews">{{reviewSummary.totalReviews}} reviews</span>
            </div>
          </div>

          <div class="rating-breakdown">
            <div class="rating-bar" *ngFor="let rating of [5,4,3,2,1]">
              <span class="rating-label">{{rating}} star</span>
              <div class="bar-container">
                <div 
                  class="bar-fill" 
                  [style.width.%]="getRatingPercentage(rating)">
                </div>
              </div>
              <span class="rating-count">{{getRatingCount(rating)}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter and Sort Controls -->
      <div class="reviews-controls" *ngIf="reviews.length > 0">
        <div class="filter-controls">
          <select [(ngModel)]="selectedRatingFilter" (ngModelChange)="filterReviews()" class="filter-select">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select [(ngModel)]="sortOrder" (ngModelChange)="sortReviews()" class="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        <div class="reviews-count">
          {{filteredReviews.length}} of {{reviews.length}} reviews
        </div>
      </div>

      <!-- Add Review Form -->
      <div class="add-review-section" *ngIf="canAddReview && !userHasReviewed">
        <h4>Write a Review</h4>
        
        <form (ngSubmit)="onSubmitReview()" #reviewForm="ngForm" class="review-form">
          <div class="rating-input">
            <label>Your Rating *</label>
            <app-star-rating 
              [rating]="newReview.rating"
              [interactive]="true"
              (ratingChange)="newReview.rating = $event">
            </app-star-rating>
            <small *ngIf="newReview.rating === 0" class="error-text">Please select a rating</small>
          </div>
          
          <div class="form-group">
            <label>Review Title</label>
            <input 
              type="text" 
              [(ngModel)]="newReview.title"
              name="title"
              placeholder="Summarize your experience"
              class="form-control"
              maxlength="100">
          </div>
          
          <div class="form-group">
            <label>Your Review *</label>
            <textarea 
              [(ngModel)]="newReview.comment"
              name="comment"
              required
              placeholder="Share your experience with this product..."
              class="form-control review-textarea"
              maxlength="1000">
            </textarea>
            <small class="char-count">{{newReview.comment.length}}/1000 characters</small>
          </div>

          <div class="form-group">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="newReview.recommend"
                name="recommend">
              I would recommend this product
            </label>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="reviewForm.invalid || newReview.rating === 0 || reviewLoading">
              <span *ngIf="!reviewLoading">Submit Review</span>
              <span *ngIf="reviewLoading">Submitting...</span>
            </button>
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="cancelReview()">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- User's Existing Review -->
      <div class="user-review" *ngIf="userReview">
        <h4>Your Review</h4>
        <div class="review-item user-review-item">
          <div class="review-header">
            <app-star-rating [rating]="userReview.rating"></app-star-rating>
            <span class="review-date">{{formatDate(userReview.createdAt)}}</span>
            <div class="review-actions">
              <button class="btn btn-sm btn-outline" (click)="editUserReview()">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="deleteUserReview()">Delete</button>
            </div>
          </div>
          <h5 class="review-title" *ngIf="userReview.title">{{userReview.title}}</h5>
          <p class="review-comment">{{userReview.comment}}</p>
          <div class="review-recommend" *ngIf="userReview.recommend">
            <span class="recommend-badge">✓ Recommends this product</span>
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list" *ngIf="!loading">
        <div class="reviews-header" *ngIf="filteredReviews.length > 0">
          <h4>Customer Reviews</h4>
        </div>

        <div class="review-item" *ngFor="let review of paginatedReviews; trackBy: trackByReviewId">
          <div class="review-header">
            <div class="reviewer-info">
              <span class="reviewer-name">{{review.userName || 'Anonymous'}}</span>
              <span class="verified-badge" *ngIf="review.verified">✓ Verified Purchase</span>
            </div>
            <div class="review-meta">
              <app-star-rating [rating]="review.rating"></app-star-rating>
              <span class="review-date">{{formatDate(review.createdAt)}}</span>
            </div>
          </div>
          
          <h5 class="review-title" *ngIf="review.title">{{review.title}}</h5>
          <p class="review-comment">{{review.comment}}</p>
          
          <div class="review-footer">
            <div class="review-recommend" *ngIf="review.recommend">
              <span class="recommend-badge">✓ Recommends this product</span>
            </div>
            
            <div class="review-helpful">
              <span class="helpful-text">Was this helpful?</span>
              <button 
                class="helpful-btn"
                [class.active]="review.userFoundHelpful"
                (click)="toggleHelpful(review)">
                👍 {{review.helpfulCount || 0}}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="filteredReviews.length > reviewsPerPage">
          <button 
            class="page-btn"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)">
            Previous
          </button>

          <span class="page-info">
            Page {{currentPage}} of {{totalPages}}
          </span>

          <button 
            class="page-btn"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)">
            Next
          </button>
        </div>

        <div class="no-reviews" *ngIf="filteredReviews.length === 0 && reviews.length > 0">
          <p>No reviews match your current filter. <button class="link-btn" (click)="clearFilters()">Show all reviews</button></p>
        </div>
      </div>

      <!-- Empty State -->
      <div class="no-reviews-state" *ngIf="!loading && reviews.length === 0">
        <div class="empty-icon">⭐</div>
        <h4>No reviews yet</h4>
        <p>Be the first to review this product and help other customers!</p>
        <button 
          *ngIf="canAddReview" 
          class="btn btn-primary"
          (click)="scrollToReviewForm()">
          Write a Review
        </button>
      </div>

      <app-loading-spinner 
        *ngIf="loading" 
        message="Loading reviews...">
      </app-loading-spinner>
    </div>
  `,
  styles: [`
    .reviews-container {
      margin-top: 40px;
    }

    .reviews-summary {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .reviews-summary h3 {
      margin: 0 0 25px 0;
      color: #333;
      font-size: 24px;
    }

    .summary-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 40px;
    }

    .average-rating-section {
      text-align: center;
    }

    .average-score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .score {
      font-size: 48px;
      font-weight: 700;
      color: #28a745;
    }

    .total-reviews {
      color: #666;
      font-size: 14px;
    }

    .rating-breakdown {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rating-bar {
      display: grid;
      grid-template-columns: 60px 1fr 40px;
      align-items: center;
      gap: 12px;
    }

    .rating-label {
      font-size: 14px;
      color: #666;
    }

    .bar-container {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: #ffc107;
      transition: width 0.3s ease;
    }

    .rating-count {
      font-size: 14px;
      color: #666;
      text-align: right;
    }

    .reviews-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .filter-controls {
      display: flex;
      gap: 15px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .reviews-count {
      color: #666;
      font-size: 14px;
    }

    .add-review-section {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .add-review-section h4 {
      margin: 0 0 25px 0;
      color: #333;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .rating-input {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rating-input label {
      font-weight: 600;
      color: #333;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .form-control {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .review-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .char-count {
      color: #666;
      font-size: 12px;
      text-align: right;
    }

    .error-text {
      color: #dc3545;
      font-size: 12px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }

    .user-review {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .user-review h4 {
      margin: 0 0 15px 0;
      color: #28a745;
    }

    .user-review-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
    }

    .reviews-list {
      margin-top: 30px;
    }

    .reviews-header h4 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .review-item {
      background: white;
      padding: 25px;
      border-radius: 8px;
      border: 1px solid #eee;
      margin-bottom: 20px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .reviewer-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .reviewer-name {
      font-weight: 600;
      color: #333;
    }

    .verified-badge {
      color: #28a745;
      font-size: 12px;
      font-weight: 500;
    }

    .review-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
    }

    .review-date {
      color: #666;
      font-size: 14px;
    }

    .review-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    .review-comment {
      color: #555;
      line-height: 1.6;
      margin: 0 0 15px 0;
    }

    .review-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .recommend-badge {
      background: #d4edda;
      color: #155724;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .review-helpful {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .helpful-text {
      color: #666;
      font-size: 14px;
    }

    .helpful-btn {
      background: white;
      border: 1px solid #ddd;
      padding: 6px 12px;
      border-radius: 16px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
    }

    .helpful-btn:hover {
      background: #f8f9fa;
    }

    .helpful-btn.active {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .review-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
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

    .btn-outline {
      background: white;
      border: 1px solid #28a745;
      color: #28a745;
    }

    .btn-outline:hover {
      background: #28a745;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .link-btn {
      background: none;
      border: none;
      color: #28a745;
      cursor: pointer;
      text-decoration: underline;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
    }

    .page-btn {
      padding: 10px 20px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
    }

    .page-btn:hover:not(:disabled) {
      background: #f8f9fa;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .no-reviews-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .no-reviews-state h4 {
      color: #333;
      margin-bottom: 10px;
    }

    .no-reviews-state p {
      color: #666;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .summary-content {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .reviews-controls {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .filter-controls {
        justify-content: center;
      }

      .review-header {
        flex-direction: column;
        gap: 15px;
      }

      .review-footer {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProductReviewsComponent implements OnInit, OnChanges {
  @Input() productId!: number;
  @Input() canAddReview: boolean = false;

  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  paginatedReviews: Review[] = [];
  reviewSummary: ReviewSummary | null = null;
  userReview: Review | null = null;
  
  loading = false;
  reviewLoading = false;
  selectedRatingFilter = '';
  sortOrder = 'newest';
  
  // Pagination
  currentPage = 1;
  reviewsPerPage = 10;
  totalPages = 1;

  userHasReviewed = false;
  
  newReview: any = {
    productId: 0,
    rating: 0,
    title: '',
    comment: '',
    recommend: false
  };

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    if (this.productId) {
      this.loadReviews();
      this.loadReviewSummary();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      this.loadReviews();
      this.loadReviewSummary();
    }
  }

  loadReviews() {
    this.loading = true;
    this.reviewService.getProductReviews(this.productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.checkUserReview();
        this.filterReviews();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  loadReviewSummary() {
    this.reviewService.getProductReviewSummary(this.productId).subscribe({
      next: (summary) => {
        this.reviewSummary = summary;
      },
      error: (error) => {
        console.error('Error loading review summary:', error);
      }
    });
  }

  checkUserReview() {
    // Check if current user has already reviewed this product
    this.userReview = this.reviews.find(review => review.userId === this.getCurrentUserId()) || null;
    this.userHasReviewed = !!this.userReview;
  }

  getCurrentUserId(): number {
    // This should get the current user ID from authentication service
    return 1; // Placeholder
  }

  onSubmitReview() {
    if (this.newReview.rating === 0 || !this.newReview.comment.trim()) {
      return;
    }
    
    this.reviewLoading = true;
    this.newReview.productId = this.productId;
    
    this.reviewService.addReview(this.newReview).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.userReview = review;
        this.userHasReviewed = true;
        this.filterReviews();
        this.loadReviewSummary();
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
      productId: this.productId,
      rating: 0,
      title: '',
      comment: '',
      recommend: false
    };
  }

  cancelReview() {
    this.resetReviewForm();
  }

  editUserReview() {
    if (this.userReview) {
      this.newReview = { ...this.userReview };
      this.userHasReviewed = false; // Show form
    }
  }

  deleteUserReview() {
    if (!this.userReview || !confirm('Are you sure you want to delete your review?')) {
      return;
    }

    this.reviewService.deleteReview(this.userReview.reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.reviewId !== this.userReview!.reviewId);
        this.userReview = null;
        this.userHasReviewed = false;
        this.filterReviews();
        this.loadReviewSummary();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
      }
    });
  }

  filterReviews() {
    let filtered = [...this.reviews];

    // Filter by rating
    if (this.selectedRatingFilter) {
      const rating = parseInt(this.selectedRatingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    this.filteredReviews = filtered;
    this.sortReviews();
  }

  sortReviews() {
    this.filteredReviews.sort((a, b) => {
      switch (this.sortOrder) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return 0;
      }
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  clearFilters() {
    this.selectedRatingFilter = '';
    this.sortOrder = 'newest';
    this.filterReviews();
  }

  getRatingPercentage(rating: number): number {
    if (!this.reviewSummary || this.reviewSummary.totalReviews === 0) {
      return 0;
    }
    return ((this.reviewSummary.ratingDistribution[rating] || 0) / this.reviewSummary.totalReviews) * 100;
  }

  getRatingCount(rating: number): number {
    return this.reviewSummary?.ratingDistribution[rating] || 0;
  }

  toggleHelpful(review: Review) {
    // Toggle helpful status
    review.userFoundHelpful = !review.userFoundHelpful;
    review.helpfulCount = (review.helpfulCount || 0) + (review.userFoundHelpful ? 1 : -1);
    
    // In real implementation, make API call to save this
    console.log(`Review ${review.reviewId} marked as ${review.userFoundHelpful ? 'helpful' : 'not helpful'}`);
  }

  trackByReviewId(index: number, review: Review): number {
    return review.reviewId;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  scrollToReviewForm() {
    // In real implementation, scroll to review form
    console.log('Scroll to review form');
  }
} 