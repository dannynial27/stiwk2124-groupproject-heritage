import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { Product } from '../../models/product.model';
import { of, switchMap, Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;

  showAddForm = false;
  editingProduct: Product | null = null;
  currentProduct: Product = this.getEmptyProduct();
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  searchQuery = '';
  deletingIds = new Set<number>();
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.filterProducts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.currentProduct = { ...product };
    this.showAddForm = true;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    window.scrollTo(0, 0); // Scroll to top to show form
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.deletingIds.add(product.productId);
      this.productService.deleteProduct(product.productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.productId !== product.productId);
          this.filterProducts();
          this.deletingIds.delete(product.productId);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.deletingIds.delete(product.productId);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      // Generate a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmitProduct(): void {
    console.log('onSubmitProduct called', this.currentProduct);
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const uploadObservable: Observable<string | null | undefined> = this.selectedFile
      ? this.imageService.uploadProductImage(this.selectedFile, this.currentProduct.category, this.currentProduct.name, !!this.editingProduct).pipe(
        map((response: { imagePath: string }) => response.imagePath)
      )
      : of(this.currentProduct.imagePath);
    uploadObservable.pipe(
      switchMap(imagePath => {
        this.currentProduct.imagePath = imagePath ?? undefined;
        const operation = this.editingProduct
          ? this.productService.updateProduct(this.editingProduct!.productId, this.currentProduct)
          : this.productService.addProduct(this.currentProduct);
        return operation;
      })
    ).subscribe({
      next: () => {
        this.loadProducts();
        this.successMessage = this.editingProduct ? 'Product updated successfully!' : 'Product added successfully!';
        setTimeout(() => {
          this.successMessage = null;
          this.cancelForm();
        }, 1200);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error saving product:', err);
        this.errorMessage = 'Failed to save product. Please check your input.';
        this.loading = false;
      }
    });
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.currentProduct = this.getEmptyProduct();
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  getEmptyProduct(): Product {
    return {
      productId: 0,
      name: '',
      description: '',
      price: 0,
      category: '',
      stockQuantity: 0,
      imagePath: ''
    };
  }

  getImageUrl(imagePath: string | null): string {
    return this.imageService.getProductImageUrl(imagePath ?? undefined);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.imageService.getDefaultImageUrl();
  }
}
