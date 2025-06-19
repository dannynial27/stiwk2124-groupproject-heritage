import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="admin-products-container">
      <div class="header-section">
        <h1>Manage Products</h1>
        <button class="btn btn-primary" (click)="showAddForm = true">
          Add New Product
        </button>
      </div>

      <!-- Add/Edit Product Form -->
      <div class="product-form" *ngIf="showAddForm || editingProduct">
        <h3>{{editingProduct ? 'Edit Product' : 'Add New Product'}}</h3>
        
        <form (ngSubmit)="onSubmitProduct()" #productForm="ngForm">
          <div class="form-group">
            <label>Product Name:</label>
            <input 
              type="text" 
              [(ngModel)]="currentProduct.name"
              name="name"
              required
              class="form-control">
          </div>

          <div class="form-group">
            <label>Description:</label>
            <textarea 
              [(ngModel)]="currentProduct.description"
              name="description"
              required
              class="form-control"
              rows="3">
            </textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price (RM):</label>
              <input 
                type="number" 
                [(ngModel)]="currentProduct.price"
                name="price"
                required
                min="0"
                step="0.01"
                class="form-control">
            </div>

            <div class="form-group">
              <label>Stock Quantity:</label>
              <input 
                type="number" 
                [(ngModel)]="currentProduct.stockQuantity"
                name="stockQuantity"
                required
                min="0"
                class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label>Category:</label>
            <select 
              [(ngModel)]="currentProduct.category"
              name="category"
              required
              class="form-control">
              <option value="">Select Category</option>
              <option value="Madu">🍯 Madu</option>
              <option value="Mee">🍜 Mee</option>
              <option value="Minuman">☕ Minuman</option>
              <option value="Rempah">🌶️ Rempah</option>
              <option value="Sos">🥫 Sos</option>
              <option value="Lain-lain">📦 Lain-lain</option>
            </select>
          </div>

          <div class="form-group">
            <label>Image Path (optional):</label>
            <input 
              type="text" 
              [(ngModel)]="currentProduct.imagePath"
              name="imagePath"
              placeholder="e.g., Madu/product-image.png"
              class="form-control">
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="productForm.invalid || loading">
              {{editingProduct ? 'Update Product' : 'Add Product'}}
            </button>
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="cancelForm()">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Products Table -->
      <div class="products-table" *ngIf="!loading">
        <div class="table-header">
          <h3>All Products ({{products.length}})</h3>
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search products..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterProducts()"
              class="search-input">
          </div>
        </div>

        <div class="table-container">
          <table class="products-table-content">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts">
                <td>
                  <img 
                    [src]="getImageUrl(product.imagePath)"
                    [alt]="product.name"
                    class="product-thumb"
                    (error)="onImageError($event)">
                </td>
                <td class="product-name">{{product.name}}</td>
                <td>
                  <span class="category-badge">{{product.category}}</span>
                </td>
                <td class="price">RM {{product.price.toFixed(2)}}</td>
                <td>
                  <span 
                    class="stock-badge"
                    [class.low-stock]="product.stockQuantity <= 5 && product.stockQuantity > 0"
                    [class.out-of-stock]="product.stockQuantity === 0">
                    {{product.stockQuantity}}
                  </span>
                </td>
                <td class="actions">
                  <button 
                    class="btn btn-sm btn-outline"
                    (click)="editProduct(product)">
                    Edit
                  </button>
                  <button 
                    class="btn btn-sm btn-danger"
                    (click)="deleteProduct(product)"
                    [disabled]="deletingIds.has(product.productId)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="filteredProducts.length === 0">
          <h4>No products found</h4>
          <p>Try adjusting your search or add new products.</p>
        </div>
      </div>

      <app-loading-spinner 
        *ngIf="loading" 
        message="Loading products...">
      </app-loading-spinner>
    </div>
  `,
  styles: [`
    .admin-products-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header-section h1 {
      font-size: 32px;
      color: #333;
      margin: 0;
    }

    .product-form {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .product-form h3 {
      margin: 0 0 25px 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .form-control:focus {
      border-color: #28a745;
      outline: none;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 25px;
    }

    .products-table {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      border-bottom: 1px solid #eee;
    }

    .table-header h3 {
      margin: 0;
      color: #333;
    }

    .search-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      width: 250px;
    }

    .table-container {
      overflow-x: auto;
    }

    .products-table-content {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table-content th,
    .products-table-content td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .products-table-content th {
      background: #f8f9fa;
      font-weight: 600;
      color: #555;
    }

    .product-thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }

    .product-name {
      font-weight: 600;
      color: #333;
    }

    .category-badge {
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .price {
      font-weight: 600;
      color: #28a745;
    }

    .stock-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background: #e9ecef;
      color: #495057;
    }

    .stock-badge.low-stock {
      background: #fff3cd;
      color: #856404;
    }

    .stock-badge.out-of-stock {
      background: #f8d7da;
      color: #721c24;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #218838;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-outline {
      background: white;
      border: 1px solid #28a745;
      color: #28a745;
    }

    .btn-outline:hover {
      background: #28a745;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .table-header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .search-input {
        width: 100%;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  loading = false;
  showAddForm = false;
  editingProduct: Product | null = null;
  searchQuery = '';
  
  deletingIds = new Set<number>();
  
  currentProduct: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stockQuantity: 0,
    imagePath: ''
  };

  constructor(
    private productService: ProductService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filterProducts();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  filterProducts() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
  }

  onSubmitProduct() {
    if (this.editingProduct) {
      // Update existing product
      this.productService.updateProduct(this.editingProduct.productId, this.currentProduct as Product).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.productId === updatedProduct.productId);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.filterProducts();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(this.currentProduct as Product).subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.filterProducts();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.currentProduct = { ...product };
    this.showAddForm = false;
  }

  deleteProduct(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    this.deletingIds.add(product.productId);
    
    this.productService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.productId !== product.productId);
        this.filterProducts();
        this.deletingIds.delete(product.productId);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.deletingIds.delete(product.productId);
      }
    });
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingProduct = null;
    this.currentProduct = {
      name: '',
      description: '',
      price: 0,
      category: '',
      stockQuantity: 0,
      imagePath: ''
    };
  }

  getImageUrl(imagePath?: string): string {
    return this.imageService.getProductImageUrl(imagePath);
  }

  onImageError(event: any) {
    event.target.src = this.imageService.getDefaultImageUrl();
  }
}