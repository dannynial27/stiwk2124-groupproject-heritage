import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

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

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.username || !/^[a-zA-Z0-9]+$/.test(this.username)) {
      this.errorMessage = 'Username must be a non-empty string or combination of letters and numbers.';
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(this.password)) {
      this.errorMessage = 'Password must be a non-empty string.';
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: (response: { token: string; user: User }) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', response.user.role.toLowerCase());
        if (response.user.role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin-dashboard']).then(() => {}, (err: any) => console.error(err));
        } else {
          this.router.navigate(['/home']).then(() => {}, (err: any) => console.error(err));
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}
