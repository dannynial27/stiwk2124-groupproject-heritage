import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
    } else if (/^\d+$/.test(this.password)) {
      localStorage.setItem('role', 'user');
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }

  logout() {
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
