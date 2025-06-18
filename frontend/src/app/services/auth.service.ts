import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In a real app, this would be determined after login
  private currentUser: User = {
    id: 1, // Example user ID
    username: 'AdamYau',
    email: 'AdamYau@example.com',
    role: 'CUSTOMER' // Change to 'ADMIN' to test admin routes
  };

  private jwtToken = 'your-jwt-token-after-login'; // Example token

  constructor() { }

  getCurrentUser(): Observable<User | null> {
    // In a real app, you might decode the JWT or have user info in localStorage
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
