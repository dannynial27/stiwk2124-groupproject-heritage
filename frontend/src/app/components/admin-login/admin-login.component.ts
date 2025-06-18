import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        if (localStorage.getItem('role') === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.errorMessage = 'You are not an admin.';
        }
      },
      error: () => {
        this.errorMessage = 'Invalid admin credentials.';
      }
    });
  }
}
