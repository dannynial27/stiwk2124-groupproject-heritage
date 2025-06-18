import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/qurba/api/cart';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  addItemToCart(userId: number, productId: number, quantity: number): Observable<Cart> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${userId}/add?productId=${productId}&quantity=${quantity}`;
    return this.http.post<Cart>(url, {}, { headers });
  }

  updateItemQuantity(userId: number, productId: number, quantity: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${userId}/update?productId=${productId}&quantity=${quantity}`;
    return this.http.put(url, {}, { headers });
  }

  removeItem(userId: number, productId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${userId}/remove?productId=${productId}`;
    return this.http.delete(url, { headers });
  }

  clearCart(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${userId}/clear`, { headers });
  }
}
