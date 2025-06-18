import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ShippingInfo } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/qurba/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- Customer Endpoints ---
  checkout(userId: number, shippingInfo: ShippingInfo): Observable<Order> {
    const url = `${this.apiUrl}/checkout/${userId}`;
    return this.http.post<Order>(url, shippingInfo, { headers: this.getAuthHeaders() });
  }

  getUserOrders(userId: number): Observable<Order[]> {
    const url = `${this.apiUrl}/orders/${userId}`;
    return this.http.get<Order[]>(url, { headers: this.getAuthHeaders() });
  }

  getOrderSummary(orderId: number): Observable<Order> {
    const url = `${this.apiUrl}/orders/${orderId}/summary`;
    return this.http.get<Order>(url, { headers: this.getAuthHeaders() });
  }

  // --- Admin Endpoints ---
  getAllOrders(): Observable<Order[]> {
    const url = `${this.apiUrl}/admin/orders`;
    return this.http.get<Order[]>(url, { headers: this.getAuthHeaders() });
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    const url = `${this.apiUrl}/admin/orders/${orderId}/status`;
    return this.http.patch<Order>(url, { status }, { headers: this.getAuthHeaders() });
  }

  filterOrders(filters: { status?: string, year?: number, month?: number }): Observable<Order[]> {
    let params = new HttpParams();
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    // Note: The backend has separate endpoints for filtering. This combines them.
    // A more robust solution might check which filter is active and call the correct URL.
    // For simplicity, we use the status filter here.
    const url = `${this.apiUrl}/admin/orders/filter`;
    return this.http.get<Order[]>(url, { headers: this.getAuthHeaders(), params });
  }
}
