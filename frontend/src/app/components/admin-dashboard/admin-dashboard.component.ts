import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (!this.checkAdmin()) {
      alert('Only admins can access this page. Please login.');
      this.router.navigate(['/admin-login']);
    }
  }

  private checkAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
}
