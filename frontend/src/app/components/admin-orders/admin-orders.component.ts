import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ImageService } from '../../services/image.service';
import { Order } from '../../models/order.model';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  sortColumn: string = 'orderDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  expandedOrderId: number | null = null;
  
  statuses: string[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  private originalOrders: Order[] = [];

  constructor(
    private orderService: OrderService,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.originalOrders = orders;
      this.orders = this.sortOrdersArray(orders);
      this.isLoading = false;
    });
  }

  filterByStatus(event: any): void {
    const status = event.target.value;
    let filteredOrders = status ? this.originalOrders.filter(o => o.status === status) : this.originalOrders;
    this.orders = this.sortOrdersArray(filteredOrders);
  }
  
  toggleOrderDetails(orderId: number): void {
    const order = this.orders.find(o => o.orderId === orderId);

    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null; // Collapse if already expanded
    } else {
      this.expandedOrderId = orderId; // Expand
      if (order && !order.detailsLoaded) { // Check if details need fetching
        order.isLoadingDetails = true;
        this.orderService.getOrderById(orderId).subscribe({
          next: (detailedOrder) => {
            // Merge details into the existing order object
            const index = this.orders.findIndex(o => o.orderId === orderId);
            if (index !== -1) {
              this.orders[index] = { ...this.orders[index], ...detailedOrder, detailsLoaded: true, isLoadingDetails: false };
            }
          },
          error: (err) => {
            console.error(`Failed to load details for order #${orderId}`, err);
            if (order) {
              order.isLoadingDetails = false;
            }
          }
        });
      }
    }
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.orders = this.sortOrdersArray(this.orders);
  }
  
  private sortOrdersArray(orders: Order[]): Order[] {
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((o, key) => (o && o[key] !== 'undefined' ? o[key] : null), obj);
    };

    return [...orders].sort((a, b) => {
      const aValue = getNestedValue(a, this.sortColumn);
      const bValue = getNestedValue(b, this.sortColumn);

      if (this.sortColumn === 'orderDate') {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      }
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  updateStatus(order: Order, event: any): void {
    const newStatus = event.target.value;
    if (order.user) {
        this.orderService.updateOrderStatus(order.orderId, newStatus).subscribe(() => {
            order.status = newStatus as any; // Update the status locally for immediate feedback
        });
    }
  }
}
