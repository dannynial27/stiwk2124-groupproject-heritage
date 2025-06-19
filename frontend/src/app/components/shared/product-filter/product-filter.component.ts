import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';

export interface AdvancedFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  template: `
    <div class="filter-container">
      <div class="filter-header">
        <h4>Filter Products</h4>
        <button 
          class="clear-btn"
          (click)="clearAllFilters()"
          *ngIf="hasActiveFilters()">
          Clear All
        </button>
      </div>

      <!-- Search Filter -->
      <div class="filter-section">
        <label class="filter-label">Search Products</label>
        <div class="search-input-container">
          <input 
            type="text" 
            [(ngModel)]="filters.searchQuery"
            (ngModelChange)="onFilterChange()"
            placeholder="Search by name or description..."
            class="search-input">
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="filter-section">
        <label class="filter-label">Category</label>
        <select 
          [(ngModel)]="filters.category" 
          (ngModelChange)="onFilterChange()"
          class="filter-select">
          <option value="">All Categories</option>
          <option value="Madu">🍯 Madu</option>
          <option value="Mee">🍜 Mee</option>
          <option value="Minuman">☕ Minuman</option>
          <option value="Rempah">🌶️ Rempah</option>
          <option value="Sos">🥫 Sos</option>
          <option value="Lain-lain">📦 Lain-lain</option>
        </select>
      </div>

      <!-- Price Range Filter -->
      <div class="filter-section">
        <label class="filter-label">Price Range (RM)</label>
        <div class="price-range">
          <div class="price-inputs">
            <input 
              type="number" 
              [(ngModel)]="filters.minPrice"
              (ngModelChange)="onFilterChange()"
              placeholder="Min"
              min="0"
              class="price-input">
            <span class="price-separator">-</span>
            <input 
              type="number" 
              [(ngModel)]="filters.maxPrice"
              (ngModelChange)="onFilterChange()"
              placeholder="Max"
              min="0"
              class="price-input">
          </div>
          
          <!-- Price Range Slider -->
          <div class="price-slider" *ngIf="maxPriceRange > 0">
            <input 
              type="range" 
              [min]="0"
              [max]="maxPriceRange"
              [(ngModel)]="filters.minPrice"
              (ngModelChange)="onFilterChange()"
              class="range-slider min-range">
            <input 
              type="range" 
              [min]="0"
              [max]="maxPriceRange"
              [(ngModel)]="filters.maxPrice"
              (ngModelChange)="onFilterChange()"
              class="range-slider max-range">
          </div>
          
          <div class="price-display">
            RM {{filters.minPrice || 0}} - RM {{filters.maxPrice || maxPriceRange}}
          </div>
        </div>
      </div>

      <!-- Rating Filter -->
      <div class="filter-section">
        <label class="filter-label">Minimum Rating</label>
        <div class="rating-filters">
          <div 
            class="rating-option"
            *ngFor="let rating of [4.5, 4, 3.5, 3, 2.5]; let i = index"
            [class.active]="filters.minRating === rating"
            (click)="setMinRating(rating)">
            <app-star-rating [rating]="rating" [showText]="false"></app-star-rating>
            <span class="rating-text">{{rating}}+ stars</span>
          </div>
          <div 
            class="rating-option"
            [class.active]="!filters.minRating"
            (click)="setMinRating(undefined)">
            <span class="rating-text">All Ratings</span>
          </div>
        </div>
      </div>

      <!-- Availability Filters -->
      <div class="filter-section">
        <label class="filter-label">Availability</label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              [(ngModel)]="filters.inStock"
              (ngModelChange)="onFilterChange()">
            <span class="checkmark"></span>
            In Stock Only
          </label>
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              [(ngModel)]="filters.onSale"
              (ngModelChange)="onFilterChange()">
            <span class="checkmark"></span>
            On Sale
          </label>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="filter-section">
        <label class="filter-label">Sort By</label>
        <select 
          [(ngModel)]="filters.sortBy" 
          (ngModelChange)="onFilterChange()"
          class="filter-select">
          <option value="">Default</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
        
        <div class="sort-order" *ngIf="filters.sortBy">
          <label class="radio-label">
            <input 
              type="radio" 
              [(ngModel)]="filters.sortOrder"
              (ngModelChange)="onFilterChange()"
              value="asc">
            <span class="radio-mark"></span>
            Ascending
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              [(ngModel)]="filters.sortOrder"
              (ngModelChange)="onFilterChange()"
              value="desc">
            <span class="radio-mark"></span>
            Descending
          </label>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="active-filters" *ngIf="hasActiveFilters()">
        <h5>Active Filters:</h5>
        <div class="filter-tags">
          <span class="filter-tag" *ngIf="filters.category">
            {{filters.category}}
            <button (click)="removeFilter('category')">×</button>
          </span>
          <span class="filter-tag" *ngIf="filters.minPrice || filters.maxPrice">
            RM {{filters.minPrice || 0}} - {{filters.maxPrice || 'Max'}}
            <button (click)="removeFilter('price')">×</button>
          </span>
          <span class="filter-tag" *ngIf="filters.minRating">
            {{filters.minRating}}+ stars
            <button (click)="removeFilter('rating')">×</button>
          </span>
          <span class="filter-tag" *ngIf="filters.inStock">
            In Stock
            <button (click)="removeFilter('inStock')">×</button>
          </span>
          <span class="filter-tag" *ngIf="filters.onSale">
            On Sale
            <button (click)="removeFilter('onSale')">×</button>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e9ecef;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e9ecef;
    }

    .filter-header h4 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .clear-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .clear-btn:hover {
      background: #c82333;
    }

    .filter-section {
      margin-bottom: 20px;
    }

    .filter-label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .search-input-container {
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 10px 35px 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .search-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .filter-select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: white;
    }

    .price-range {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .price-input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .price-separator {
      color: #666;
      font-weight: 500;
    }

    .price-slider {
      position: relative;
      margin: 10px 0;
    }

    .range-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      -webkit-appearance: none;
      position: absolute;
      top: 0;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #28a745;
      cursor: pointer;
    }

    .range-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #28a745;
      cursor: pointer;
      border: none;
    }

    .min-range {
      z-index: 1;
    }

    .max-range {
      z-index: 2;
    }

    .price-display {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #28a745;
      margin-top: 20px;
    }

    .rating-filters {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rating-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .rating-option:hover {
      background: #f8f9fa;
    }

    .rating-option.active {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .rating-text {
      font-size: 14px;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .checkmark {
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 3px;
      position: relative;
    }

    input[type="checkbox"]:checked + .checkmark {
      background: #28a745;
      border-color: #28a745;
    }

    input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: -2px;
      left: 2px;
      color: white;
      font-size: 12px;
    }

    input[type="checkbox"] {
      display: none;
    }

    .sort-order {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .radio-mark {
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 50%;
      position: relative;
    }

    input[type="radio"]:checked + .radio-mark {
      border-color: #28a745;
    }

    input[type="radio"]:checked + .radio-mark::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #28a745;
    }

    input[type="radio"] {
      display: none;
    }

    .active-filters {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e9ecef;
    }

    .active-filters h5 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 14px;
    }

    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .filter-tag {
      background: #e9ecef;
      color: #495057;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .filter-tag button {
      background: none;
      border: none;
      color: #495057;
      font-size: 14px;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .filter-tag button:hover {
      background: rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .filter-container {
        padding: 15px;
      }

      .price-inputs {
        flex-direction: column;
        align-items: stretch;
      }

      .price-separator {
        text-align: center;
      }

      .filter-tags {
        flex-direction: column;
      }
    }
  `]
})
export class ProductFilterComponent implements OnInit {
  @Input() maxPriceRange: number = 1000;
  @Input() initialFilters: AdvancedFilter = {};
  @Output() filtersChange = new EventEmitter<AdvancedFilter>();

  filters: AdvancedFilter = {
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    inStock: false,
    onSale: false,
    searchQuery: '',
    sortBy: '',
    sortOrder: 'asc'
  };

  ngOnInit() {
    this.filters = { ...this.filters, ...this.initialFilters };
    this.initializePriceRange();
  }

  initializePriceRange() {
    if (!this.filters.maxPrice) {
      this.filters.maxPrice = this.maxPriceRange;
    }
  }

  onFilterChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  setMinRating(rating?: number) {
    this.filters.minRating = rating;
    this.onFilterChange();
  }

  removeFilter(filterType: string) {
    switch (filterType) {
      case 'category':
        this.filters.category = '';
        break;
      case 'price':
        this.filters.minPrice = undefined;
        this.filters.maxPrice = this.maxPriceRange;
        break;
      case 'rating':
        this.filters.minRating = undefined;
        break;
      case 'inStock':
        this.filters.inStock = false;
        break;
      case 'onSale':
        this.filters.onSale = false;
        break;
    }
    this.onFilterChange();
  }

  clearAllFilters() {
    this.filters = {
      category: '',
      minPrice: undefined,
      maxPrice: this.maxPriceRange,
      minRating: undefined,
      inStock: false,
      onSale: false,
      searchQuery: '',
      sortBy: '',
      sortOrder: 'asc'
    };
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.category ||
      this.filters.minPrice ||
      (this.filters.maxPrice && this.filters.maxPrice < this.maxPriceRange) ||
      this.filters.minRating ||
      this.filters.inStock ||
      this.filters.onSale ||
      this.filters.searchQuery ||
      this.filters.sortBy
    );
  }
} 