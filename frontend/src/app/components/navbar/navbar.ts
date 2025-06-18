import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  role = localStorage.getItem('role') || ''; // [Change 1: Define role property with default value]

  logout(): void { // [Change 2: Add logout method]
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this.role = ''; // Update role after logout
    console.log('Logged out');
    // Navigate to login page if needed
  }
}
