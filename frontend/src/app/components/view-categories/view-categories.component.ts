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
    if (this.newCategory && !this.categories.includes(this.newCategory)) {
      this.productService.addCategory(this.newCategory).subscribe(() => {
        this.categories.push(this.newCategory);
        this.newCategory = '';
      });
    }
  }

  deleteCategory(category: string): void {
    if (confirm(`Are you sure you want to delete ${category}?`)) {
      this.productService.deleteCategory(category).subscribe(() => {
        this.categories = this.categories.filter(c => c !== category);
      });
    }
  }
}
