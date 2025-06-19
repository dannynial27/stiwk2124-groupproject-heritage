import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> | undefined;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/admin-login']);
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.products$ = this.productService.getProducts();
  }

  deleteProduct(productId: number | undefined): void {
    if (!productId) {
      alert('Cannot delete product: Invalid product ID');
      return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Failed to delete product:', err);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  editProduct(product: Product): void {
    if (!product.productId) {
      alert('Cannot edit product: Invalid product ID');
      return;
    }
    this.router.navigate(['/edit-product', product.productId]);
  }
}
