import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string = '';
  user: User = { username: '', email: '', password: '', role: 'CUSTOMER' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}
