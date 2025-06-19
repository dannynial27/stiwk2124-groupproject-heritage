import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart$: Observable<Cart> = of({
    cartItems: [],
    totalAmount: 0
  });

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.cart$ = this.cartService.getCart(userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  updateQuantity(item: any): void {
    if (!item || !item.product || !item.product.productId) {
      console.error('Invalid cart item or product ID');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (item.quantity > 0) {
      this.cartService.updateItemQuantity(userId, item.product.productId, item.quantity).subscribe({
        next: () => {
          // Successfully updated
        },
        error: (err) => {
          console.error('Failed to update quantity:', err);
          alert('Failed to update quantity. Please try again.');
        }
      });
    }
  }

  removeItem(productId: number | undefined): void {
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.removeItem(userId, productId).subscribe({
      next: () => {
        // Refresh cart after removing item
        this.cart$ = this.cartService.getCart(userId);
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
        alert('Failed to remove item. Please try again.');
      }
    });
  }
}
