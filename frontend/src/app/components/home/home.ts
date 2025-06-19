import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Product } from '../../models/product.model';

interface CategoryWithImage {
  name: string;
  imagePath: string;
}

interface Testimonial {
  name: string;
  rating: number;
  quote: string;
  avatarPath: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  allProducts: Product[] = [];
  categories: string[] = ['Madu', 'Mee', 'Minuman', 'Rempah', 'Sos', 'Lain-lain'];
  categoriesWithImages: CategoryWithImage[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  testimonials: Testimonial[] = [
    {
      name: "Ahmad Rahman",
      rating: 5,
      quote: "The Ameen Qurba honey is absolutely exceptional. It's pure, authentic, and has a taste that reminds me of my childhood.",
      avatarPath: "assets/customer/male1.webp" // First image
    },
    {
      name: "Nurul Hasan",
      rating: 5,
      quote: "I love the traditional herbal tea blends. They're fragrant, soothing, and perfect for a relaxing evening.",
      avatarPath: "assets/customer/female2.jpg" // Second image
    },
    {
      name: "Nurul Aisha",
      rating: 5, 
      quote: "The premium spices have transformed my cooking. Authentic flavors that make every dish special!",
      avatarPath: "assets/customer/female1.jpg" // Third image
    }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.allProducts = products;
        this.selectRandomFeaturedProducts();
        this.generateCategoryImages();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load products:', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        
        // Fallback products for development/demo
        this.loadFallbackProducts();
        this.generateFallbackCategoryImages();
      }
    });
  }
  
  generateCategoryImages(): void {
    // Clear existing categories with images
    this.categoriesWithImages = [];
    
    // Create a map to store the first product found for each category
    const categoryProductMap: Map<string, Product> = new Map();
    
    // Find the first product for each category
    this.allProducts.forEach(product => {
      if (!categoryProductMap.has(product.category) && product.imagePath) {
        categoryProductMap.set(product.category, product);
      }
    });
    
    // Create the categoriesWithImages array using the map
    this.categories.forEach(category => {
      const product = categoryProductMap.get(category);
      if (product) {
        this.categoriesWithImages.push({
          name: category,
          imagePath: this.getImageUrl(product)
        });
      } else {
        // Use a default image path if no product is found for this category
        this.categoriesWithImages.push({
          name: category,
          imagePath: `${this.imageService.apiUrl}/product/default`
        });
      }
    });
  }
  
  generateFallbackCategoryImages(): void {
    this.categoriesWithImages = [
      { name: 'Madu', imagePath: '/api/images/product/Madu/premium-honey.png' },
      { name: 'Mee', imagePath: '/api/images/product/Mee/noodle-collection.png' },
      { name: 'Minuman', imagePath: '/api/images/product/Minuman/herbal-tea.png' },
      { name: 'Rempah', imagePath: '/api/images/product/Rempah/spice-mix.png' },
      { name: 'Sos', imagePath: '/api/images/product/Sos/premium-sauce.png' },
      { name: 'Lain-lain', imagePath: '/api/images/product/default' }
    ];
  }

  loadFallbackProducts(): void {
    this.featuredProducts = [
      { 
        productId: 1, 
        name: 'Premium Honey', 
        price: 15.00, 
        imagePath: '/api/images/product/Madu/premium-honey.png', 
        available: true, 
        category: 'Madu', 
        description: 'Pure natural honey from Malaysian forests', 
        stockQuantity: 10
      },
      { 
        productId: 2, 
        name: 'Herbal Tea', 
        price: 10.00, 
        imagePath: '/api/images/product/Minuman/herbal-tea.png', 
        available: true, 
        category: 'Minuman', 
        description: 'Traditional herbal tea blend with exotic herbs', 
        stockQuantity: 50 
      },
      { 
        productId: 3, 
        name: 'Special Spice Mix', 
        price: 8.50, 
        imagePath: '/api/images/product/Rempah/spice-mix.png', 
        available: true, 
        category: 'Rempah', 
        description: 'Authentic Malaysian spice blend for traditional dishes', 
        stockQuantity: 0
      },
      { 
        productId: 4, 
        name: 'Noodle Collection', 
        price: 12.00, 
        imagePath: '/api/images/product/Mee/noodle-collection.png', 
        available: true, 
        category: 'Mee', 
        description: 'Handcrafted traditional noodles using heritage techniques', 
        stockQuantity: 25
      }
    ];
  }
  
  selectRandomFeaturedProducts(): void {
    // Shuffle all products and take first 4
    if (this.allProducts.length <= 4) {
      this.featuredProducts = [...this.allProducts];
      return;
    }
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...this.allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Take first 4 products
    this.featuredProducts = shuffled.slice(0, 4);
  }
  
  refreshFeaturedProducts(): void {
    if (this.allProducts.length > 0) {
      this.selectRandomFeaturedProducts();
    } else {
      this.loadAllProducts();
    }
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
        this.showAddedToCartNotification(product.name);
      },
      error: (err: any) => {
        console.error('Failed to add product to cart:', err);
        alert('Failed to add product to cart. Please try again.');
      }
    });
  }
  
  showAddedToCartNotification(productName: string): void {
    // Implementation would depend on your UI notification system
    // This is a simple alert but could be replaced with a toast notification
    alert(`${productName} has been added to your cart!`);
  }

  getImageUrl(product: Product): string {
    if (!product.imagePath) {
      return this.imageService.getSafeProductImageUrl(product.category, product.name);
    }
    return product.imagePath;
  }
  
  browseCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category: category } });
  }
  
  viewProductDetails(product: Product): void {
    if (product.productId) {
      this.router.navigate(['/products', product.productId]);
    }
  }
  
  loadFeaturedProducts(): void {
    this.loadAllProducts();
  }

  // Add the rating display helper method
  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
