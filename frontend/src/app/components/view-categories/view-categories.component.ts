import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css']
})
export class ViewCategoriesComponent implements OnInit {
  categories: string[] = [];
  newCategory: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading = false;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (!role || role.toLowerCase() !== 'admin') {
      alert('Only admins can access this page.');
      this.router.navigate(['/login']); // Changed from '/admin-login' to '/login'
      return;
    }
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (!this.newCategory.trim()) {
      this.errorMessage = 'Category name cannot be empty.';
      return;
    }
    if (this.categories.includes(this.newCategory.trim())) {
      this.errorMessage = 'Category already exists.';
      return;
    }
    this.loading = true;
    this.productService.addCategory(this.newCategory.trim()).subscribe({
      next: () => {
        this.categories.push(this.newCategory.trim());
        this.successMessage = 'Category added successfully!';
        this.newCategory = '';
        this.loading = false;
        setTimeout(() => this.successMessage = null, 1200);
      },
      error: () => {
        this.errorMessage = 'Failed to add category. Please try again.';
        this.loading = false;
      }
    });
  }

  deleteCategory(category: string): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (confirm(`Are you sure you want to delete ${category}?`)) {
      this.loading = true;
      this.productService.deleteCategory(category).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c !== category);
          this.successMessage = 'Category deleted successfully!';
          this.loading = false;
          setTimeout(() => this.successMessage = null, 1200);
        },
        error: () => {
          this.errorMessage = 'Failed to delete category. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
