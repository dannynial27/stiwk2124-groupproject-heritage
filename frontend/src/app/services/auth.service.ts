import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/qurba/api/auth';
  
  constructor(private http: HttpClient) { }
  
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
          // If the backend doesn't return user information directly, construct it
          const userData: User = {
            username: username,
            // Set default values for other required properties
            email: '',
            password: '',
            role: response.role || this.extractRoleFromToken(response.token) || 'CUSTOMER'
          };
          
          return {
            token: response.token,
            user: userData
          };
        }),
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role.toLowerCase());
        }),
        catchError(this.handleError)
      );
  }
  
  private extractRoleFromToken(token: string): string {
    try {
      // Simple extraction - in real apps you'd use a proper JWT decoder
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.role || 'CUSTOMER';
    } catch (e) {
      console.error('Failed to extract role from token', e);
      return 'CUSTOMER';
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
    return user && user.id ? user.id : null;
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getRole(): string | null {
    return localStorage.getItem('role');
  }
  
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
