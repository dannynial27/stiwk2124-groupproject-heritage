import { Component, OnInit, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
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
export class MyOrdersComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  isLoading = true;
  activeOrderIndex: number = 0;
  sortDirection: 'asc' | 'desc' = 'desc';
  
  @ViewChildren('accordionBody') accordionBodies!: QueryList<ElementRef>;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.orderService.getUserOrders(userId).subscribe(orders => {
        this.orders = this.sortOrdersArray(orders);
        this.isLoading = false;
      });
    }
  }

  ngAfterViewInit(): void {
    this.accordionBodies.changes.subscribe(() => {
      this.accordionBodies.forEach((el, index) => {
        if (index === this.activeOrderIndex) {
          el.nativeElement.style.height = 'auto';
        } else {
          el.nativeElement.style.height = '0px';
        }
      });
    });
  }
  
  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    this.orders = this.sortOrdersArray(this.orders);
    // When sorting, collapse all items for predictability
    this.activeOrderIndex = -1; 
  }

  private sortOrdersArray(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  toggleAccordion(index: number): void {
    const element = this.accordionBodies.toArray()[index].nativeElement;
    
    if (this.activeOrderIndex === index) {
      // Collapse
      element.style.height = `${element.scrollHeight}px`;
      requestAnimationFrame(() => {
        element.style.height = '0px';
      });
      this.activeOrderIndex = -1;
    } else {
      // Collapse the currently active one first if there is one
      if (this.activeOrderIndex !== -1) {
        const currentActiveElement = this.accordionBodies.toArray()[this.activeOrderIndex].nativeElement;
        currentActiveElement.style.height = '0px';
      }
      
      // Expand the new one
      this.activeOrderIndex = index;
      element.style.height = `${element.scrollHeight}px`;

      // After the animation, set height to 'auto' to handle content changes
      setTimeout(() => {
        if (this.activeOrderIndex === index) {
          element.style.height = 'auto';
        }
      }, 350); // Match transition duration
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
