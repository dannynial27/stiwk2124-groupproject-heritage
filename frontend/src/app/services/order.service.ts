import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Order, ShippingInfo } from '../models/order.model';
import { tap, switchMap, concatMap, toArray, catchError } from 'rxjs/operators';
import { CartService } from './cart.service';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/qurba/api';
  private adminApiUrl = 'http://localhost:8080/qurba/api/admin';

  // Create a BehaviorSubject to track order count
  private orderCountSubject = new BehaviorSubject<number>(0);
  public orderCount$ = this.orderCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cartService: CartService 
  ) { }

  // Customer endpoints
  checkout(userId: number, shippingInfo: ShippingInfo): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout/${userId}`, shippingInfo)
      .pipe(
        tap(() => {
          // After checkout, increment the order count
          this.updateOrderCount(this.orderCountSubject.value + 1);
        })
      );
  }

  /**
   * Performs a checkout for only a specific list of items.
   * This is a complex operation that temporarily modifies the user's cart on the backend.
   * 1. Fetches the full cart to identify items to keep.
   * 2. Clears the backend cart.
   * 3. Re-adds only the items being purchased to the cart.
   * 4. Executes the standard checkout process.
   * 5. Clears the cart again.
   * 6. Re-adds the original, un-purchased items back to the cart.
   */
  checkoutSelectedItems(userId: number, shippingInfo: ShippingInfo, itemsToCheckout: CartItem[]): Observable<Order> {
    const originalCart$ = this.cartService.loadCart();

    return originalCart$.pipe(
      switchMap(originalCart => {
        const itemsToKeep = originalCart.items.filter(
          originalItem => !itemsToCheckout.some(itemToCheckout => itemToCheckout.product.productId === originalItem.product.productId)
        );

        // 1. Clear cart
        return this.cartService.clearCart(userId).pipe(
          // 2. Add selected items back
          switchMap(() => from(itemsToCheckout)),
          concatMap(item => this.cartService.addItemToCart(userId, item.product.productId, item.quantity)),
          toArray(),
          // 3. Perform checkout
          switchMap(() => this.checkout(userId, shippingInfo)),
          // 4. Handle post-checkout cart restoration
          tap({
            next: () => {
              // On success, the backend clears the cart, so just add back the items to keep
              this.restoreCart(userId, itemsToKeep);
            },
            error: () => {
              // On error, also try to restore the original cart state
              this.restoreCart(userId, originalCart.items);
            }
          })
        );
      })
    );
  }

  private restoreCart(userId: number, items: CartItem[]) {
    this.cartService.clearCart(userId).pipe(
      switchMap(() => from(items)),
      concatMap(item => this.cartService.addItemToCart(userId, item.product.productId, item.quantity)),
      toArray()
    ).subscribe({
      next: () => this.cartService.loadCart().subscribe(), // Refresh service state
      error: err => console.error('Failed to restore cart', err)
    });
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`)
      .pipe(
        tap(orders => {
          // Update order count when orders are fetched
          this.updateOrderCount(orders.length);
        })
      );
  }

  getOrderSummary(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/summary`);
  }

  // Method to update order count
  private updateOrderCount(count: number): void {
    this.orderCountSubject.next(count);
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

  createOrder(orderData: any): Observable<Order> {
    const userId = orderData.userId;
    delete orderData.userId;
    return this.checkout(userId, orderData);
  }
}
