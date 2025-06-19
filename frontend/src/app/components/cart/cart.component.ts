import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { WishlistService } from '../../services/wishlist.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { Cart, CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [] };
  loading = true;
  selectedItems = new Set<number>();
  loadingItems = new Set<number>();
  bulkLoading = false;
  showWishlistNotification = false;
  movedItemsCount = 0;
  movedItemNames: string[] = [];
  
  private subscriptions: Subscription[] = [];
  private wishlistNotificationTimer: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private imageService: ImageService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.subscribeToCartChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadCart(): void {
    this.loading = true;
    this.cartService.loadCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    });
  }

  private subscribeToCartChanges(): void {
    const cartSub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    this.subscriptions.push(cartSub);
  }

  // Image handling
  getProductImageUrl(product: Product): string {
    return this.imageService.getProductImageUrl(product.imagePath);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.imageService.getDefaultImageUrl();
    }
  }

  // Quantity management
  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stockQuantity) {
      this.updateQuantity(item, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  onQuantityChange(item: CartItem, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value);
    
    if (newQuantity >= 1 && newQuantity <= item.product.stockQuantity) {
      this.updateQuantity(item, newQuantity);
    } else {
      // Reset to current quantity if invalid
      target.value = item.quantity.toString();
    }
  }

  private updateQuantity(item: CartItem, newQuantity: number): void {
    const productId = item.product.productId;
    const itemInCart = this.cart.items.find(i => i.product.productId === productId);

    if (!itemInCart) { return; }

    const originalQuantity = itemInCart.quantity;

    // Optimistically update local state for a faster user experience
    itemInCart.quantity = newQuantity;

    // Disable buttons to prevent rapid clicks while the request is in flight
    this.loadingItems.add(productId);

    this.cartService.updateCartItem(productId, newQuantity).subscribe({
      next: (updatedCartFromServer) => {
        // The server has confirmed the update. The main cart$ subscription will
        // also receive this, but updating here ensures our state is in sync.
        this.cart = updatedCartFromServer;
        this.loadingItems.delete(productId);
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        // Revert the change in the UI on error
        const itemToRevert = this.cart.items.find(i => i.product.productId === productId);
        if (itemToRevert) {
          itemToRevert.quantity = originalQuantity;
        }
        this.loadingItems.delete(productId);
        // Optionally, show a user-facing error message here.
      }
    });
  }

  // Item management
  removeItem(item: CartItem): void {
    if (confirm(`Remove ${item.product.name} from cart?`)) {
      this.loadingItems.add(item.product.productId);
      
      this.cartService.removeFromCart(item.product.productId).subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loadingItems.delete(item.product.productId);
          this.selectedItems.delete(item.product.productId);
        },
        error: (error) => {
          console.error('Error removing item:', error);
          this.loadingItems.delete(item.product.productId);
        }
      });
    }
  }

  moveToWishlist(item: CartItem): void {
    this.loadingItems.add(item.product.productId);
    
    this.wishlistService.addToWishlist(item.product.productId).subscribe({
      next: () => {
        this.removeFromCartAndFinalize(item);
        this.showWishlistMoveNotification(1, [item.product.name]);
      },
      error: (error) => {
        // If item is already in wishlist (400 error), just remove from cart to complete the "move"
        if (error.status === 400 && error.error?.error?.includes('already in wishlist')) {
          this.removeFromCartAndFinalize(item);
          this.showWishlistMoveNotification(1, [item.product.name]);
        } else {
          console.error('Error adding to wishlist:', error);
          this.loadingItems.delete(item.product.productId);
        }
      }
    });
  }

  private removeFromCartAndFinalize(item: CartItem): void {
    this.cartService.removeFromCart(item.product.productId).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loadingItems.delete(item.product.productId);
        this.selectedItems.delete(item.product.productId);
      },
      error: (cartError) => {
        console.error('Error removing from cart:', cartError);
        this.loadingItems.delete(item.product.productId);
      }
    });
  }

  // Selection management
  toggleItemSelection(productId: number): void {
    if (this.selectedItems.has(productId)) {
      this.selectedItems.delete(productId);
    } else {
      this.selectedItems.add(productId);
    }
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedItems.clear();
    } else {
      this.cart.items.forEach(item => {
        this.selectedItems.add(item.product.productId);
      });
    }
  }

  isAllSelected(): boolean {
    return this.cart.items.length > 0 && this.selectedItems.size === this.cart.items.length;
  }

  isSomeSelected(): boolean {
    return this.selectedItems.size > 0 && this.selectedItems.size < this.cart.items.length;
  }

  // Bulk operations
  removeSelectedItems(): void {
    if (this.selectedItems.size === 0) return;
    
    const itemNames = this.cart.items
      .filter(item => this.selectedItems.has(item.product.productId))
      .map(item => item.product.name)
      .join(', ');
    
    if (confirm(`Remove ${this.selectedItems.size} items from cart?\n\n${itemNames}`)) {
      this.bulkLoading = true;
      
      const removeObservables = Array.from(this.selectedItems).map(productId =>
        this.cartService.removeFromCart(productId).pipe(
          catchError(error => {
            console.error(`Failed to remove item ${productId}`, error);
            return of(null); // Continue even if one fails
          })
        )
      );
      
      forkJoin(removeObservables).subscribe({
        complete: () => {
          this.loadCart(); // Refresh cart from server
        this.selectedItems.clear();
        this.bulkLoading = false;
        }
      });
    }
  }

  moveSelectedToWishlist(): void {
    if (this.selectedItems.size === 0) return;
    
    this.bulkLoading = true;
    
    // Get names of selected products for notification
    const selectedProductNames = this.cart.items
      .filter(item => this.selectedItems.has(item.product.productId))
      .map(item => item.product.name);
    
    const moveObservables = Array.from(this.selectedItems).map(productId => {
      // This logic is complex because it chains two calls.
      // A more robust implementation might be needed in a real app,
      // potentially on the backend (a single "move to wishlist" endpoint).
      return this.wishlistService.addToWishlist(productId).pipe(
        catchError(err => {
          // If already in wishlist, we can ignore the error and proceed with removal from cart
          if (err.status === 400) {
            return of(null);
          }
          throw err; // Re-throw other errors
        }),
        // Chain the next operation
        // switchMap(() => this.cartService.removeFromCart(productId))
        // For simplicity and given the separate addTo and removeFrom, we do them sequentially.
        // A better approach would be a dedicated backend endpoint.
        // Here we'll just add to wishlist and then remove from cart.
      );
    });
    
    forkJoin(moveObservables).subscribe({
      next: () => {
        // Now remove all from cart
        const removeObservables = Array.from(this.selectedItems).map(productId =>
          this.cartService.removeFromCart(productId).pipe(
            catchError(error => {
              console.error(`Failed to remove item ${productId} from cart after moving to wishlist`, error);
              return of(null);
            })
          )
        );
        forkJoin(removeObservables).subscribe({
          complete: () => {
            this.loadCart();
            this.showWishlistMoveNotification(this.selectedItems.size, selectedProductNames);
      this.selectedItems.clear();
      this.bulkLoading = false;
          }
        });
      },
      error: error => {
      console.error('Error moving items to wishlist:', error);
      this.bulkLoading = false;
        this.loadCart(); // Refresh state
      }
    });
  }

  // Simplified notification method without using NotificationService
  private showWishlistMoveNotification(count: number, productNames: string[]): void {
    // If a notification is already showing, append the new items
    if (this.showWishlistNotification) {
      this.movedItemsCount += count;
      this.movedItemNames = [...this.movedItemNames, ...productNames];
    } else {
      this.movedItemsCount = count;
      this.movedItemNames = productNames;
    }

    this.showWishlistNotification = true;
    
    // Clear any existing timer to reset the countdown
    if (this.wishlistNotificationTimer) {
      clearTimeout(this.wishlistNotificationTimer);
    }
    
    // Auto-hide after 10 seconds
    this.wishlistNotificationTimer = setTimeout(() => {
      this.showWishlistNotification = false;
      // Reset after hiding
      this.movedItemsCount = 0;
      this.movedItemNames = [];
    }, 10000);
  }
  
  // Method to navigate to wishlist
  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }
  
  // Method to dismiss notification
  dismissWishlistNotification(): void {
    this.showWishlistNotification = false;
    if (this.wishlistNotificationTimer) {
      clearTimeout(this.wishlistNotificationTimer);
    }
    this.movedItemsCount = 0;
    this.movedItemNames = [];
  }

  // Calculations
  calculateSubtotal(): number {
    return this.cart.items
      .filter(item => this.selectedItems.has(item.product.productId))
      .reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  getShippingCost(): number {
    if (this.selectedItems.size === 0) {
      return 0;
    }
    const subtotal = this.calculateSubtotal();
    return subtotal >= 100 ? 0 : 10; // Free shipping over RM100
  }

  getDiscountAmount(): number {
    return 0; // Promo code system removed
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.getShippingCost() - this.getDiscountAmount();
  }

  getTotalItems(): number {
    return this.cart.items
      .filter(item => this.selectedItems.has(item.product.productId))
      .reduce((total, item) => total + item.quantity, 0);
  }

  // Utility methods
  getStockStatus(product: Product): string {
    if (product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity <= 5) return `Only ${product.stockQuantity} left`;
    return 'In Stock';
  }

  hasOutOfStockItems(): boolean {
    return this.cart.items
      .filter(item => this.selectedItems.has(item.product.productId))
      .some(item => item.product.stockQuantity === 0);
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.productId;
  }

  // Navigation
  proceedToCheckout(): void {
    if (this.selectedItems.size === 0 || this.hasOutOfStockItems()) {
      return;
    }
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' } 
      });
      return;
    }
    
    const itemsToCheckout = this.cart.items.filter(item => 
      this.selectedItems.has(item.product.productId)
    );
    this.cartService.setItemsForCheckout(itemsToCheckout);
    
    this.router.navigate(['/checkout']);
  }

  // Utility method for safe productId access
  private safeProductId(item: any): number {
    if (item && item.product) {
      return item.product.productId || 0;
    }
    return 0;
  }
}