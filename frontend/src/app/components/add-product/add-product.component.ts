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
  isSubmitting: boolean = false;
  categories: string[] = [];
  productId?: number;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder, 
    private productService: ProductService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/login']);
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
      error: (err) => {
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
    this.isSubmitting = true;
    const productData: Product = {
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
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
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
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}