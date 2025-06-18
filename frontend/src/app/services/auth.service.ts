import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/qurba/api/auth';
  private currentUser: User | null = null;
  private jwtToken: string | null = null;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.jwtToken = token;
      this.currentUser = JSON.parse(user);
    }
  }

  login(username: string, password: string): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>(`${this.apiUrl}/login`, { username, password }).pipe(
        tap(response => {
          this.jwtToken = response.token;
          this.currentUser = response.user;
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role.toLowerCase());
        })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
        tap(() => {
          // Optionally auto-login after registration
        })
    );
  }

  logout(): void {
    this.currentUser = null;
    this.jwtToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.currentUser);
  }

  getUserId(): number | null {
    return this.currentUser?.id ?? null;
  }

  getUserRole(): 'CUSTOMER' | 'ADMIN' | null {
    return this.currentUser?.role ?? null;
  }

  getToken(): string | null {
    return this.jwtToken;
  }
}
