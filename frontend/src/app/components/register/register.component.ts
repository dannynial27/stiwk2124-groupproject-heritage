import { Component, AfterViewInit } from '@angular/core';
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
export class RegisterComponent implements AfterViewInit {
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  
  user: User = { 
    username: '', 
    email: '', 
    password: '', 
    role: 'CUSTOMER' 
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    // Add active class to selected role option
    setTimeout(() => {
      this.updateSelectedRole();
    });
  }

  updateSelectedRole() {
    const customerOption = document.querySelector('#customerRole')?.parentElement as HTMLElement;
    const adminOption = document.querySelector('#adminRole')?.parentElement as HTMLElement;
    
    if (customerOption && adminOption) {
      if (this.user.role === 'CUSTOMER') {
        customerOption.classList.add('selected');
        adminOption.classList.remove('selected');
      } else {
        adminOption.classList.add('selected');
        customerOption.classList.remove('selected');
      }
    }
  }

  onRoleChange() {
    this.updateSelectedRole();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Form validation
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'All fields are required';
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }
    
    // Password validation - require at least 6 characters
    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }
    
    this.isLoading = true;

    // Convert role to uppercase to match backend expectations
    const userToRegister = {
      ...this.user,
      role: this.user.role.toUpperCase()
    };

    this.authService.register(userToRegister).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = err.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
