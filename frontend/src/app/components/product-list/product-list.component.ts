import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Observable, of } from 'rxjs'; // Added 'of' import

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Observable<Product[]> = of([]);

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/admin-login']).then(() => {}, (err: any) => console.error(err));
      return;
    }
    this.products = this.productService.getProducts();
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.productService.getProducts();
        },
        error: (err: any) => console.error('Failed to delete product:', err)
      });
    }
  }
}
