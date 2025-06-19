import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/qurba/api/cart';
  
  // State management for cart
  private cartSubject = new BehaviorSubject<Cart>({ items: [] });
  private cartCountSubject = new BehaviorSubject<number>(0);
  private itemsForCheckoutSubject = new BehaviorSubject<CartItem[]>([]);
  
  public cart$ = this.cartSubject.asObservable();
  public cartCount$ = this.cartCountSubject.asObservable();
  public itemsForCheckout$ = this.itemsForCheckoutSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadInitialCartData();
  }

  // Load cart data from the API
  loadCart(): Observable<Cart> {
    const userId = this.getCurrentUserId();
    return this.getCart(userId);
  }

  // Get cart data from API
  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      })
    );
  }

  // Add item to cart
  addToCart(productId: number, quantity: number = 1): Observable<Cart> {
    const userId = this.getCurrentUserId();
    return this.addItemToCart(userId, productId, quantity);
  }

  // Add item to cart with userId
  addItemToCart(userId: number, productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.apiUrl}/${userId}/add?productId=${productId}&quantity=${quantity}`,
      {},  // Empty body since we're using query params
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      })
    );
  }

  // Update cart item
  updateCartItem(productId: number, quantity: number): Observable<Cart> {
    const userId = this.getCurrentUserId();
    return this.updateItemQuantity(userId, productId, quantity);
  }

  // Update item quantity
  updateItemQuantity(userId: number, productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.apiUrl}/${userId}/update?productId=${productId}&quantity=${quantity}`,
      {},  // Empty body since we're using query params
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      })
    );
  }

  // Remove item from cart
  removeFromCart(productId: number): Observable<Cart> {
    const userId = this.getCurrentUserId();
    return this.removeItem(userId, productId);
  }

  // Remove item from cart with userId
  removeItem(userId: number, productId: number): Observable<Cart> {
    return this.http.delete<Cart>(
      `${this.apiUrl}/${userId}/remove?productId=${productId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
      })
    );
  }

  // Clear cart
  clearCart(userId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${userId}/clear`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        this.cartSubject.next({ items: [] });
        this.cartCountSubject.next(0);
      })
    );
  }

  // Helper methods
  getCurrentUserId(): number {
    return this.authService.getUserId() || 0;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  isInCart(productId: number): boolean {
    const cart = this.cartSubject.value;
    return cart.items.some(item => item.product.productId === productId);
  }

  getProductQuantityInCart(productId: number): number {
    const cart = this.cartSubject.value;
    const item = cart.items.find(item => item.product.productId === productId);
    return item ? item.quantity : 0;
  }

  calculateCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  setItemsForCheckout(items: CartItem[]): void {
    this.itemsForCheckoutSubject.next(items);
  }

  private updateCartCount(cart: Cart): void {
    if (!cart || !cart.items) {
      this.cartCountSubject.next(0);
      return;
    }
    
    const totalItems = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    this.cartCountSubject.next(totalItems);
  }

  private loadInitialCartData() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.getCart(userId).subscribe({
        next: (cart: Cart) => {
          this.cartSubject.next(cart);
          this.updateCartCount(cart);
        },
        error: (error: any) => console.error('Error loading initial cart:', error)
      });
    }
  }
}
