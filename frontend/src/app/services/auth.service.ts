import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/qurba/api/auth';
  
  // Add BehaviorSubject to track authentication state
  private authStateSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public authState$ = this.authStateSubject.asObservable();
  
  // Add BehaviorSubject to track user data
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) { 
    // Check token validity on service initialization
    this.checkTokenValidity();
  }
  
  private checkTokenValidity(): void {
    // You could add token expiration check here
    const isLoggedIn = this.hasValidToken();
    this.authStateSubject.next(isLoggedIn);
    
    if (!isLoggedIn) {
      this.currentUserSubject.next(null);
    }
  }
  
  private hasValidToken(): boolean {
    return !!localStorage.getItem('token');
  }
  
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  login(username: string, password: string): Observable<{token: string; user: User}> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map(response => {
          // Extract user ID and role from JWT token
          const userId = this.extractUserIdFromToken(response.token);
          const role = this.extractRoleFromToken(response.token);
          
          // Create user object with correct properties
          const userData: User = {
            userId: userId, // Changed from id to userId
            username: username,
            email: '',
            password: '',
            role: role || 'CUSTOMER'
          };
          
          console.log('Login successful. User:', userData);
          
          return {
            token: response.token,
            user: userData
          };
        }),
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role);
          
          // Update auth state
          this.authStateSubject.next(true);
          this.currentUserSubject.next(response.user);
          
          console.log('Auth state updated. User is now authenticated.');
        }),
        catchError(this.handleError)
      );
  }
  
  private extractRoleFromToken(token: string): string {
    try {
      // JWT tokens are encoded in three parts: header.payload.signature
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.role || '';
    } catch (error) {
      console.error('Error extracting role from token', error);
      return '';
    }
  }
  
  private extractUserIdFromToken(token: string): number {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('Token payload:', decodedPayload); // Log the payload for debugging
      return decodedPayload.userId || 0;
    } catch (error) {
      console.error('Error extracting userId from token', error);
      return 0;
    }
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = `An error occurred: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    // This is critical - make sure to update the auth state
    this.authStateSubject.next(false);
    this.currentUserSubject.next(null);
    
    console.log('User logged out. Auth state updated.');
  }
  
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  }
  
  getUserId(): number | null {
    const user = this.getUser();
    return user && user.userId ? user.userId : null; // Changed from user.id to user.userId
  }
  
  isLoggedIn(): boolean {
    return this.authStateSubject.value;
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getRole(): string | null {
    return localStorage.getItem('role');
  }
  
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN' || role === 'admin';
  }
  
  isCustomer(): boolean {
    const role = this.getRole();
    return role === 'CUSTOMER' || role === 'customer';
  }
  
  isAuthenticated(): boolean {
    return this.authStateSubject.value;
  }

  getCurrentUserId(): number {
    return this.getUserId() || 0;
  }
}
