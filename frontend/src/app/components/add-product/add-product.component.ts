import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { Product } from '../../models/product.model';
import { of, switchMap, Observable, map } from 'rxjs';

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

  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  currentImagePath: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private imageService: ImageService,
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
        this.currentImagePath = product.imagePath ?? null;
      },
      error: (err: any) => {
        console.error('Failed to load product:', err);
        this.errorMessage = 'Failed to load product. Please try again.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const formValue = this.productForm.value;

    const uploadObservable: Observable<string | null | undefined> = this.selectedFile
      ? this.imageService.uploadProductImage(this.selectedFile, formValue.category, formValue.name, this.isEditMode).pipe(
          map((response: { imagePath?: string; imageUrl?: string }) => response.imagePath)
        )
      : of(formValue.imagePath);

    uploadObservable.pipe(
      switchMap(imagePath => {
        const productData = { ...formValue, imagePath: imagePath ?? undefined };
        const operation = this.isEditMode
          ? this.productService.updateProduct(this.productId!, productData)
          : this.productService.addProduct(productData);
        return operation;
      })
    ).subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Product updated successfully!' : 'Product added successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1200);
      },
      error: (err: any) => {
        console.error('Error saving product:', err);
        if (err && err.error && err.error.message) {
          this.errorMessage = 'Failed to save product: ' + err.error.message;
        } else if (err && err.message) {
          this.errorMessage = 'Failed to save product: ' + err.message;
        } else {
          this.errorMessage = 'Failed to save product. Please check your input.';
        }
        this.isSubmitting = false;
      }
    });
  }

  getImageUrl(imagePath: string | null): string {
    return this.imageService.getProductImageUrl(imagePath ?? undefined);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.imageService.getDefaultImageUrl();
  }
}
