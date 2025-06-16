import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('role');
    this.role = null;
    this.router.navigate(['/login']);
  }
}
