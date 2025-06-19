import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: Product | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/admin-login']).then(() => {}, (err: any) => console.error(err));
      return;
    }
  }

  onSubmit(): void {
    if (this.product) {
      this.productService.addProduct(this.product).subscribe({
        next: () => {
          this.router.navigate(['/product-list']).then(() => {}, (err: any) => console.error(err));
        },
        error: (err: any) => console.error('Failed to add product:', err)
      });
    }
  }
}
