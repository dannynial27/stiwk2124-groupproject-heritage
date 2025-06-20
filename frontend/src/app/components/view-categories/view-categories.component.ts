import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { Product } from '../../models/product.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css']
})
export class ViewCategoriesComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  loading = true;
  deletingIds = new Set<number>();

  constructor(
    private productService: ProductService,
    public imageService: ImageService, // made public for template access
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        // Use the hardcoded categories from the service to ensure consistency
        this.productService.getCategories().subscribe(categories => {
          this.categories = ['All', ...categories];
          this.filterByCategory('All');
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(p => p.category === category);
    }
  }

  editProduct(productId: number): void {
    this.router.navigate(['/edit-product', productId]);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.deletingIds.add(product.productId);
      this.productService.deleteProduct(product.productId).subscribe({
        next: () => {
          this.allProducts = this.allProducts.filter(p => p.productId !== product.productId);
          this.filterByCategory(this.selectedCategory); // Re-apply filter
          this.deletingIds.delete(product.productId);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product.');
          this.deletingIds.delete(product.productId);
        }
      });
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.imageService.getDefaultImageUrl();
  }
}
