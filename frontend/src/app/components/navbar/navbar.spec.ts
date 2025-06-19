import { Component } from '@angular/core';
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
export class NavbarComponent {
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.role = localStorage.getItem('role');
  }

  logout() {
    this.authService.logout();
    this.role = null;
    this.router.navigate(['/login']);
  }
}
