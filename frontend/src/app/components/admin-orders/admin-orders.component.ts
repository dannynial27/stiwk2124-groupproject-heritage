import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders$: Observable<Order[]> = of([]);
  statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orders$ = this.orderService.getAllOrders();
  }

  filterByStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (status) {
      this.orders$ = this.orderService.filterOrders({ status });
    } else {
      this.orders$ = this.orderService.getAllOrders();
    }
  }

  updateStatus(order: Order, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(order.orderId, newStatus).subscribe(() => {
      order.status = newStatus as Order['status'];
    });
  }
}
