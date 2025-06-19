import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  role: string | null = null;
  
  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    this.role = this.authService.getRole();
    // Subscribe to router events to ensure role is updated after navigation
    this.router.events.subscribe(() => {
      this.role = this.authService.getRole();
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.role = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
