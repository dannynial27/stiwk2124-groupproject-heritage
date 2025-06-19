import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ShippingInfo } from '../../models/order.model';
import { CartItem } from '../../models/cart.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;
  isSubmitting = false;
  userId: number | null;
  paymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'E_WALLET', 'CASH_ON_DELIVERY'];
  
  itemsToCheckout: CartItem[] = [];
  private subscription: Subscription = new Subscription();

  cartSubtotal = 0;
  shippingCost = 0;
  cartTotal = 0;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      shippingName: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingPostalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      paymentMethod: ['', Validators.required],
    });

    this.subscription = this.cartService.itemsForCheckout$.subscribe(items => {
      if (items && items.length > 0) {
        this.itemsToCheckout = items;
        this.calculateTotals();
      } else {
        // If no items, redirect back to cart
        this.router.navigate(['/cart']);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calculateTotals(): void {
    this.cartSubtotal = this.itemsToCheckout.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    this.shippingCost = this.cartSubtotal > 100 ? 0 : 10;
    this.cartTotal = this.cartSubtotal + this.shippingCost;
  }

  get f() {
    return this.checkoutForm.controls;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || !this.userId) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    
    if (this.itemsToCheckout.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      this.router.navigate(['/cart']);
      return;
    }

    this.isSubmitting = true;
    const shippingInfo: ShippingInfo = this.checkoutForm.value;

    this.orderService.checkoutSelectedItems(this.userId, shippingInfo, this.itemsToCheckout).subscribe({
      next: (order) => {
        this.router.navigate(['/order-success', order.orderId]);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Checkout failed', err);
        this.isSubmitting = false;
        alert('Checkout failed. Please try again.');
      }
    });
  }
}
