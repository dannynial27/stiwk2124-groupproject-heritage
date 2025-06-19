import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ShippingInfo } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  isSubmitting = false;
  userId: number | null;
  paymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'E_WALLET', 'CASH_ON_DELIVERY'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private authService: AuthService,
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
      paymentMethod: [this.paymentMethods[0], Validators.required],
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || !this.userId) {
      return;
    }

    this.isSubmitting = true;
    const shippingInfo: ShippingInfo = this.checkoutForm.value;

    this.orderService.checkout(this.userId, shippingInfo).subscribe({
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
