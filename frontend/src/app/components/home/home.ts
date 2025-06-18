import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../footer/footer'; // Adjust path as needed
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products.slice(0, 4); // Limit to 4 featured products
      },
      error: (err: any) => {
        this.featuredProducts = [
          { productId: 1, name: 'Honey', price: 15.00, imagePath: 'https://via.placeholder.com/200x150?text=Honey', available: true, category: 'Honey', description: '', stockQuantity: 100 },
          { productId: 2, name: 'Herbal Tea', price: 10.00, imagePath: 'https://via.placeholder.com/200x150?text=Herbal+Tea', available: true, category: 'Tea', description: '', stockQuantity: 50 }
        ];
      }
    });
  }

  addToCart(product: Product): void {
    const userId = this.authService.getUserId();
    if (userId && product.productId) {
      this.cartService.addItemToCart(userId, product.productId, 1).subscribe({
        next: () => alert('Product added to cart!'),
        error: (err: any) => console.error('Failed to add product to cart:', err)
      });
    } else {
      alert('Please login to add items to cart.');
      this.router.navigate(['/login']);
    }
  }
}
