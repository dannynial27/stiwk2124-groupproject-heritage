import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent], // Added FooterComponent
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];

  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.fetchFeaturedProducts();
  }

  fetchFeaturedProducts(): void {
    this.http.get<any[]>('/api/products/featured').subscribe({
      next: (data: any) => this.featuredProducts = data,
      error: (err: any) => {
        console.error('Error fetching featured products:', err);
        this.featuredProducts = [
          { id: 1, name: 'Honey', price: 15.00, image: 'https://via.placeholder.com/200x150?text=Honey', available: true },
          { id: 2, name: 'Herbal Tea', price: 10.00, image: 'https://via.placeholder.com/200x150?text=Herbal+Tea', available: true }
        ];
      }
    });
  }

  addToCart(product: any): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.cartService.addItemToCart(userId, product.productId, 1).subscribe({
        next: () => {
          console.log('Product added to cart successfully');
          // Optionally, provide user feedback (e.g., a toast message)
        },
        error: (err) => console.error('Failed to add product to cart:', err)
      });
    } else {
      console.error('User is not logged in.');
      // Optionally, redirect to login page or show a message
    }
  }
}
