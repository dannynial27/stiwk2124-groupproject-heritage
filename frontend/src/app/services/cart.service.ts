import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/qurba/api/cart';

  constructor(private http: HttpClient) { }

  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`);
  }

  addItemToCart(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/add?productId=${productId}&quantity=${quantity}`, {});
  }

  updateItemQuantity(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/update?productId=${productId}&quantity=${quantity}`, {});
  }

  removeItem(userId: number, productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/remove?productId=${productId}`);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/clear`);
  }
}
