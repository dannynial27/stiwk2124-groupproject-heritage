import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminUsername: string = '';
  totalProducts: number = 0;
  totalCategories: number = 0;
  totalOrders: number = 0;
  totalFeedback: number = 0;
  isLoading: boolean = true;
  currentDate: Date = new Date();

  constructor(
    private router: Router, 
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    if (!this.checkAdmin()) {
      alert('Only admins can access this page. Please login with admin credentials.');
      this.router.navigate(['/login']); 
      return;
    }
    
    // Get the admin username from local storage
    const user = this.getUser();
    if (user) {
      this.adminUsername = user.username;
    }
    
    // Load dashboard statistics
    this.loadDashboardStats();
  }

  // Make this public so it can be called from the template
  loadDashboardStats(): void {
    this.isLoading = true;
    this.currentDate = new Date(); // Update the current date on refresh
    
    // Get total products
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.totalProducts = 0;
      }
    });

    // Get categories
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories.length;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.totalCategories = 0;
      }
    });

    // Get total orders
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.totalOrders = 0;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    // Get feedback
    this.feedbackService.getFeedbacks().subscribe({
      next: (feedback) => {
        this.totalFeedback = feedback.length;
      },
      error: (err) => {
        console.error('Error fetching feedback:', err);
        this.totalFeedback = 0;
      }
    });
  }

  private checkAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
  
  private getUser(): any {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  }
}
