import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Wishlist } from '../models/wishlist.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:8080/qurba/api/wishlist';
  
  // State management for wishlist
  private wishlistSubject = new BehaviorSubject<Wishlist>({ items: [] });
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  
  public wishlist$ = this.wishlistSubject.asObservable();
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadInitialData();
  }

  // Get wishlist - Make userId optional with a default from AuthService
  getWishlist(userId?: number): Observable<Wishlist> {
    const id = userId || this.authService.getUserId() || 0;
    return this.http.get<Wishlist>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(wishlist => {
        this.wishlistSubject.next(wishlist);
        this.updateWishlistCount(wishlist);
      })
    );
  }

  // Add item to wishlist
  addToWishlist(productId: number): Observable<Wishlist> {
    const userId = this.authService.getUserId();
    return this.http.post<Wishlist>(
      `${this.apiUrl}/${userId}/add?productId=${productId}`,
      {},  // Empty body since we're using query params
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(wishlist => {
        this.wishlistSubject.next(wishlist);
        this.updateWishlistCount(wishlist);
      })
    );
  }

  // Remove item from wishlist
  removeFromWishlist(productId: number): Observable<Wishlist> {
    const userId = this.authService.getUserId();
    return this.http.delete<Wishlist>(
      `${this.apiUrl}/${userId}/remove?productId=${productId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(wishlist => {
        this.wishlistSubject.next(wishlist);
        this.updateWishlistCount(wishlist);
      })
    );
  }

  // Clear wishlist
  clearWishlist(): Observable<Wishlist> {
    const userId = this.authService.getUserId();
    return this.http.delete<Wishlist>(
      `${this.apiUrl}/${userId}/clear`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(wishlist => {
        this.wishlistSubject.next(wishlist);
        this.wishlistCountSubject.next(0);
      })
    );
  }

  // Check if product is in wishlist
  isInWishlist(productId: number): Observable<boolean> {
    const userId = this.authService.getUserId();
    return this.http.get<{isInWishlist: boolean}>(
      `${this.apiUrl}/${userId}/check/${productId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      // Update local cache for faster UI response
      tap(response => {
        const wishlist = this.wishlistSubject.value;
        const isInCache = wishlist.items.some(item => item.product.productId === productId);
        
        if (response.isInWishlist && !isInCache) {
          this.loadInitialData(); // Refresh data if inconsistent
        }
      }),
      // Transform the response to return just the boolean value
      map(response => response.isInWishlist)
    );
  }

  // Add missing method for wishlist component
  moveAllToCart(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.post<any>(
      `${this.apiUrl}/${userId}/move-to-cart`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        // Update local state after moving all items
        this.wishlistSubject.next({ items: [] });
        this.wishlistCountSubject.next(0);
      })
    );
  }

  // Add missing method for sharing
  generateShareableLink(): Observable<{shareLink: string}> {
    const userId = this.authService.getUserId();
    return this.http.get<{shareLink: string}>(
      `${this.apiUrl}/${userId}/share-link`,
      { headers: this.getAuthHeaders() }
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

  private updateWishlistCount(wishlist: Wishlist): void {
    if (!wishlist || !wishlist.items) {
      this.wishlistCountSubject.next(0);
      return;
    }
    
    this.wishlistCountSubject.next(wishlist.items.length);
  }

  private loadInitialData() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.getWishlist(userId).subscribe({
        next: (wishlist: Wishlist) => {
          this.wishlistSubject.next(wishlist);
          this.updateWishlistCount(wishlist);
        },
        error: (error: any) => console.error('Error loading initial wishlist:', error)
      });
    }
  }
}