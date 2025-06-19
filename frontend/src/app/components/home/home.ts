import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { FooterComponent } from '../footer/footer';
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
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        // Sort by price and take first 4
        this.featuredProducts = products
          .sort((a, b) => b.price - a.price)
          .slice(0, 4);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load products:', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        
        // Fallback products for development/demo
        this.featuredProducts = [
          { 
            productId: 1, 
            name: 'Premium Honey', 
            price: 15.00, 
            imagePath: '/api/images/product/Madu/premium-honey.png', 
            available: true, 
            category: 'Madu', 
            description: 'Pure natural honey from Malaysian forests', 
            stockQuantity: 100 
          },
          { 
            productId: 2, 
            name: 'Herbal Tea', 
            price: 10.00, 
            imagePath: '/api/images/product/Minuman/herbal-tea.png', 
            available: true, 
            category: 'Minuman', 
            description: 'Traditional herbal tea blend', 
            stockQuantity: 50 
          }
        ];
      }
    });
  }

  addToCart(product: Product): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Please login to add items to cart.');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!product.productId) {
      alert('Cannot add product to cart: Invalid product ID');
      return;
    }
    
    this.cartService.addItemToCart(userId, product.productId, 1).subscribe({
      next: () => {
        alert('Product added to cart successfully!');
      },
      error: (err: any) => {
        console.error('Failed to add product to cart:', err);
        alert('Failed to add product to cart. Please try again.');
      }
    });
  }

  getImageUrl(product: Product): string {
    if (!product.imagePath) {
      return this.imageService.getSafeProductImageUrl(product.category, product.name);
    }
    return product.imagePath;
  }
}
