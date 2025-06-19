import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/qurba/api/auth';
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${this.apiUrl}/login`, { username, password });
  }
  
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
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
