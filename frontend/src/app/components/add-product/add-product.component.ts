import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stockQuantity: 0,
    available: true
  };
  productId: number | null = null;
  productForm!: FormGroup;
  categories: string[] = [];
  errorMessage: string = '';

  constructor(
    private productService: ProductService, 
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/admin-login']);
      return;
    }

    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      imagePath: ['']
    });

    // Get categories
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });

    // Check if editing existing product
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stockQuantity: product.stockQuantity,
          imagePath: product.imagePath
        });
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.errorMessage = 'Failed to load product details.';
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = {
      ...this.product,
      ...this.productForm.value
    };

    if (this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.router.navigate(['/product-list']);
        },
        error: (err) => {
          console.error('Failed to update product:', err);
          this.errorMessage = 'Failed to update product. Please try again.';
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.router.navigate(['/product-list']);
        },
        error: (err) => {
          console.error('Failed to add product:', err);
          this.errorMessage = 'Failed to add product. Please try again.';
        }
      });
    }
  }
}
