import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
