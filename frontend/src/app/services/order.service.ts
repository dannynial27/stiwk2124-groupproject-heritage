import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ShippingInfo } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/qurba/api';
  private adminApiUrl = 'http://localhost:8080/qurba/api/admin';

  constructor(private http: HttpClient) { }

  // Customer endpoints
  checkout(userId: number, shippingInfo: ShippingInfo): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout/${userId}`, shippingInfo);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`);
  }

  getOrderSummary(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/summary`);
  }

  // Admin endpoints
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.adminApiUrl}/orders`);
  }

  filterOrders(filters: { status?: string, year?: number, month?: number }): Observable<Order[]> {
    let url = `${this.adminApiUrl}/orders`;
    
    if (filters.status) {
      url = `${url}/filter?status=${filters.status}`;
    } else if (filters.year && filters.month) {
      url = `${url}/by-month?year=${filters.year}&month=${filters.month}`;
    } else if (filters.year) {
      url = `${url}/by-month?year=${filters.year}`;
    }
    
    return this.http.get<Order[]>(url);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.adminApiUrl}/orders/${orderId}/status`, { status });
  }
}
