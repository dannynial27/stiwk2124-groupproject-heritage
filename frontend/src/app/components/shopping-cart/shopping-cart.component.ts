import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart$!: Observable<Cart>;

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.cart$ = this.cartService.getCart(userId);
    }
  }

  updateQuantity(item: any): void {
    const userId = this.authService.getUserId();
    if (userId && item.product.productId && typeof item.product.productId === 'number' && item.quantity > 0) {
      this.cartService.updateItemQuantity(userId, item.product.productId, item.quantity).subscribe();
    }
  }

  removeItem(item: any): void {
    const userId = this.authService.getUserId();
    if (userId && item.product.productId && typeof item.product.productId === 'number') {
      this.cartService.removeItem(userId, item.product.productId).subscribe();
    }
  }
}
