import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/qurba/api/feedback';
  private adminApiUrl = 'http://localhost:8080/qurba/api/admin/feedback';

  constructor(private http: HttpClient, private authService: AuthService) { }

  submitFeedback(userId: number, feedback: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}`, feedback);
  }

  getFeedback(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  deleteFeedback(userId: number, feedbackId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${feedbackId}`);
  }

  // Admin methods
  getFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApiUrl}`);
  }

  filterFeedbackByYear(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApiUrl}/filter?year=${year}`);
  }

  filterFeedbackByYearAndMonth(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApiUrl}/filter?year=${year}&month=${month}`);
  }

  markAsRead(feedbackId: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/${feedbackId}/read`, {});
  }

  respondToFeedback(feedbackId: number, response: string): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/${feedbackId}/respond`, { response });
  }

  clearWishlist(): Observable<void> {
    const userId = this.authService.getUserId();
    if (!userId) return throwError(() => new Error('User not logged in'));
    return this.http.delete<void>(`${this.apiUrl}/${userId}/clear`);
  }

  moveAllToCart(): Observable<void> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }
    return this.http.post<void>(`${this.apiUrl}/${userId}/move-to-cart`, {});
  }

  isInWishlist(productId: number): Observable<boolean> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }
    return this.http.get<boolean>(`${this.apiUrl}/${userId}/exists/${productId}`);
  }

  addToWishlist(productId: number): Observable<void> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }
    return this.http.post<void>(`${this.apiUrl}/${userId}/add`, { productId });
  }

  removeFromWishlist(productId: number): Observable<void> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }
    return this.http.delete<void>(`${this.apiUrl}/${userId}/remove/${productId}`);
  }
}
