import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Cart, CartItem } from '../../models/cart.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart$: Observable<Cart> = of({ items: [], totalAmount: 0 });

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      // Use the cart$ observable from the service for real-time updates
      this.cart$ = this.cartService.cart$; 
      this.cartService.loadCart().subscribe(); // Initial load
    } else {
      this.router.navigate(['/login']);
    }
  }

  incrementQuantity(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= item.product.stockQuantity) {
      this.updateItemQuantity(item.product.productId, newQuantity);
    }
  }

  decrementQuantity(item: CartItem): void {
    const newQuantity = item.quantity - 1;
    this.updateItemQuantity(item.product.productId, newQuantity);
  }

  private updateItemQuantity(productId: number, quantity: number): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    
    this.cartService.updateItemQuantity(userId, productId, quantity).subscribe({
      error: (err) => {
        console.error('Failed to update quantity:', err);
        alert('Failed to update quantity. Please try again.');
        this.cartService.loadCart().subscribe(); // Revert UI on error
      }
    });
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
      error: (err) => {
        console.error('Failed to remove item:', err);
        alert('Failed to remove item. Please try again.');
      }
    });
  }

  clearCart(): void {
    const userId = this.authService.getUserId();
    if (userId && confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart(userId).subscribe({
        error: (err) => console.error('Failed to clear cart', err)
      });
    }
  }

  getImageUrl(imagePath?: string): string {
    return this.imageService.getProductImageUrl(imagePath);
  }
}
