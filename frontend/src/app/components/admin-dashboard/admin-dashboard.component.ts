import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminUsername: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (!this.checkAdmin()) {
      alert('Only admins can access this page. Please login with admin credentials.');
      this.router.navigate(['/login']); 
      return;
    }
    
    // Get the admin username from local storage
    const user = this.getUser();
    if (user) {
      this.adminUsername = user.username;
    }
  }

  private checkAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
  
  private getUser(): any {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  }
}
