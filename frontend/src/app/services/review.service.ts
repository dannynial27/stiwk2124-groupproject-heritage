import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewRequest, ReviewSummary } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/qurba/api/reviews';

  constructor(private http: HttpClient) {}

  // Get reviews for a product
  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  // Get review summary for a product
  getProductReviewSummary(productId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.apiUrl}/product/${productId}/summary`);
  }

  // Add a review for a product
  addReview(review: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  // Update a review
  updateReview(reviewId: number, review: ReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, review);
  }

  // Delete a review
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  // Get user's reviews
  getUserReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user`);
  }
} 