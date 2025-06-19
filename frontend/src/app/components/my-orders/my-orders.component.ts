import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders$: Observable<Order[]> = of([]);

  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.orders$ = this.orderService.getUserOrders(userId);
    }
  }
}
