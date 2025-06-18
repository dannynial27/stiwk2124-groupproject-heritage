import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  login() {
    if (!this.username || !/^[a-zA-Z0-9]+$/.test(this.username)) {
      this.errorMessage = 'Username must be a non-empty string or combination of letters and numbers.';
      return;
    }

    if (!/^\d+$/.test(this.password)) {
      this.errorMessage = 'Password must contain only numbers.';
      return;
    }

    if (this.username === 'blitzer' && this.password === '1234') {
      localStorage.setItem('role', 'admin');
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.errorMessage = 'Invalid admin credentials.';
    }
  }
}
