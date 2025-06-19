import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { Observable } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders$?: Observable<Order[]>;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.orders$ = this.orderService.getUserOrders(userId);
    }
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'assets/default-product.png'; // Fallback image
    }
    
    // Path from DB is like: "assets/QurbaProductPhoto/Category/filename.png"
    // We need to construct the API URL: /api/images/product/{category}/{filename}
    const parts = imagePath.split('/');
    if (parts.length >= 4) {
      const category = parts[2];
      const filename = parts[3];
      // This should point to your backend's image serving endpoint
      return `http://localhost:8080/qurba/api/images/product/${category}/${filename}`;
    }

    return 'assets/default-product.png'; // Fallback for unexpected path format
  }
}
