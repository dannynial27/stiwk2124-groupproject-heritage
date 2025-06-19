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
  productForm!: FormGroup;
  productId: number | null = null;
  isEditMode = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (!role || role.toLowerCase() !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/login']);
      return;
    }

    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      imagePath: ['']
    });

    // Get categories
    this.productService.getCategories().subscribe({
      next: (categories: string[]) => {
        this.categories = categories;
      },
      error: (err: any) => {
        console.error('Failed to load categories:', err);
        this.errorMessage = 'Failed to load categories. Please try again.';
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
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stockQuantity: product.stockQuantity,
          imagePath: product.imagePath
        });
        this.isEditMode = true;
      },
      error: (err: any) => {
        console.error('Failed to load product:', err);
        this.errorMessage = 'Failed to load product. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
    const productData: Product = {
      productId: this.productId || 0,
      ...this.productForm.value
    };
    const request = this.productId
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.addProduct(productData);
    request.subscribe({
      next: () => {
        this.successMessage = this.productId ? 'Product updated successfully!' : 'Product added successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/admin/products']);
        }, 1200);
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to save product. Please check your input.';
        this.isSubmitting = false;
      }
    });
  }
}
