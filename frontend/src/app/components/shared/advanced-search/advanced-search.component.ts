import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  inStock: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand';
  count?: number;
}

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="advanced-search-container">
      <!-- Search Input with Autocomplete -->
      <div class="search-input-section">
        <div class="search-input-wrapper" [class.has-suggestions]="showSuggestions">
          <div class="search-input-container">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput($event)"
              (focus)="onSearchFocus()"
              (blur)="onSearchBlur()"
              (keydown)="onKeyDown($event)"
              placeholder="Search products, categories, or brands..."
              #searchInput>
            
            <button 
              *ngIf="searchQuery"
              class="clear-btn"
              (click)="clearSearch()"
              title="Clear search">
              ×
            </button>
          </div>

          <!-- Autocomplete Suggestions -->
          <div class="suggestions-dropdown" *ngIf="showSuggestions && suggestions.length > 0">
            <div class="suggestions-header">
              <span>Suggestions</span>
              <button class="close-suggestions-btn" (click)="closeSuggestions()">×</button>
            </div>
            
            <div class="suggestions-list">
              <div 
                *ngFor="let suggestion of suggestions; let i = index"
                class="suggestion-item"
                [class.highlighted]="i === highlightedIndex"
                (click)="selectSuggestion(suggestion)"
                (mouseenter)="highlightedIndex = i">
                
                <span class="suggestion-icon">
                  {{getSuggestionIcon(suggestion.type)}}
                </span>
                <span class="suggestion-text">{{suggestion.text}}</span>
                <span class="suggestion-count" *ngIf="suggestion.count">
                  ({{suggestion.count}})
                </span>
              </div>
            </div>

            <!-- Recent Searches -->
            <div class="recent-searches" *ngIf="recentSearches.length > 0 && !searchQuery">
              <div class="section-header">Recent searches</div>
              <div 
                *ngFor="let search of recentSearches.slice(0, 5)"
                class="recent-search-item"
                (click)="selectRecentSearch(search)">
                <span class="recent-icon">🕒</span>
                <span>{{search}}</span>
                <button 
                  class="remove-recent-btn"
                  (click)="removeRecentSearch(search); $event.stopPropagation()"
                  title="Remove">
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="quick-filters" *ngIf="showQuickFilters">
          <button 
            *ngFor="let category of popularCategories"
            class="quick-filter-btn"
            [class.active]="filters.category === category"
            (click)="toggleCategoryFilter(category)">
            {{getCategoryEmoji(category)}} {{category}}
          </button>
        </div>
      </div>

      <!-- Advanced Filters (Collapsible) -->
      <div class="advanced-filters" *ngIf="showAdvancedFilters">
        <div class="filters-header">
          <h4>Filters</h4>
          <button class="toggle-filters-btn" (click)="toggleFiltersExpanded()">
            {{filtersExpanded ? '▲' : '▼'}}
          </button>
        </div>

        <div class="filters-content" *ngIf="filtersExpanded">
          <!-- Price Range -->
          <div class="filter-group">
            <label class="filter-label">Price Range</label>
            <div class="price-range-inputs">
              <input 
                type="number"
                [(ngModel)]="filters.minPrice"
                (ngModelChange)="onFiltersChange()"
                placeholder="Min"
                class="price-input">
              <span class="price-separator">-</span>
              <input 
                type="number"
                [(ngModel)]="filters.maxPrice"
                (ngModelChange)="onFiltersChange()"
                placeholder="Max"
                class="price-input">
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="filter-group">
            <label class="filter-label">Minimum Rating</label>
            <div class="rating-filter">
              <div 
                *ngFor="let rating of [5,4,3,2,1]"
                class="rating-option"
                [class.active]="filters.rating === rating"
                (click)="setRatingFilter(rating)">
                <span class="stars">{{getStarsDisplay(rating)}}</span>
                <span class="rating-text">{{rating}}+ stars</span>
              </div>
            </div>
          </div>

          <!-- Stock Filter -->
          <div class="filter-group">
            <label class="filter-checkbox">
              <input 
                type="checkbox"
                [(ngModel)]="filters.inStock"
                (ngModelChange)="onFiltersChange()">
              <span class="checkmark"></span>
              Only show items in stock
            </label>
          </div>

          <!-- Filter Actions -->
          <div class="filter-actions">
            <button class="btn btn-outline" (click)="clearAllFilters()">
              Clear All
            </button>
            <button class="btn btn-primary" (click)="applyFilters()">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="active-filters" *ngIf="hasActiveFilters()">
        <span class="active-filters-label">Active filters:</span>
        
        <span class="filter-tag" *ngIf="filters.query">
          Search: "{{filters.query}}"
          <button (click)="removeFilter('query')">×</button>
        </span>
        
        <span class="filter-tag" *ngIf="filters.category">
          Category: {{filters.category}}
          <button (click)="removeFilter('category')">×</button>
        </span>
        
        <span class="filter-tag" *ngIf="filters.minPrice > 0 || filters.maxPrice > 0">
          Price: RM{{filters.minPrice || 0}} - RM{{filters.maxPrice || '∞'}}
          <button (click)="removeFilter('price')">×</button>
        </span>
        
        <span class="filter-tag" *ngIf="filters.rating > 0">
          Rating: {{filters.rating}}+ stars
          <button (click)="removeFilter('rating')">×</button>
        </span>
        
        <span class="filter-tag" *ngIf="filters.inStock">
          In Stock Only
          <button (click)="removeFilter('inStock')">×</button>
        </span>

        <button class="clear-all-filters-btn" (click)="clearAllFilters()">
          Clear All
        </button>
      </div>
    </div>
  `,
  styles: [`
    .advanced-search-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .search-input-section {
      position: relative;
      margin-bottom: 20px;
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-input-wrapper.has-suggestions {
      z-index: 100;
    }

    .search-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: #666;
      font-size: 16px;
      z-index: 2;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 40px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      font-size: 20px;
      color: #666;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .clear-btn:hover {
      background: #f8f9fa;
      color: #dc3545;
    }

    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e9ecef;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
    }

    .suggestions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      font-weight: 600;
      color: #495057;
    }

    .close-suggestions-btn {
      background: none;
      border: none;
      font-size: 16px;
      color: #666;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .close-suggestions-btn:hover {
      background: #e9ecef;
    }

    .suggestions-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      gap: 8px;
    }

    .suggestion-item:hover,
    .suggestion-item.highlighted {
      background-color: #f8f9fa;
    }

    .suggestion-icon {
      font-size: 14px;
      width: 20px;
      text-align: center;
    }

    .suggestion-text {
      flex: 1;
      color: #333;
    }

    .suggestion-count {
      color: #666;
      font-size: 12px;
    }

    .recent-searches {
      border-top: 1px solid #e9ecef;
      padding: 8px 0;
    }

    .section-header {
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }

    .recent-search-item {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      gap: 8px;
    }

    .recent-search-item:hover {
      background-color: #f8f9fa;
    }

    .recent-icon {
      font-size: 12px;
      color: #666;
    }

    .remove-recent-btn {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 4px;
      border-radius: 2px;
      margin-left: auto;
    }

    .remove-recent-btn:hover {
      background: #e9ecef;
      color: #dc3545;
    }

    .quick-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .quick-filter-btn {
      padding: 6px 12px;
      border: 1px solid #e9ecef;
      border-radius: 20px;
      background: white;
      color: #495057;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .quick-filter-btn:hover {
      border-color: #28a745;
      color: #28a745;
    }

    .quick-filter-btn.active {
      background: #28a745;
      border-color: #28a745;
      color: white;
    }

    .advanced-filters {
      border-top: 1px solid #e9ecef;
      padding-top: 20px;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .filters-header h4 {
      margin: 0;
      color: #333;
    }

    .toggle-filters-btn {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;
    }

    .filters-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-label {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .price-range-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .price-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      font-size: 14px;
    }

    .price-separator {
      color: #666;
      font-weight: 500;
    }

    .rating-filter {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .rating-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .rating-option:hover {
      background-color: #f8f9fa;
    }

    .rating-option.active {
      background-color: #e8f5e8;
      color: #28a745;
    }

    .stars {
      color: #ffc107;
      font-size: 12px;
    }

    .rating-text {
      font-size: 14px;
    }

    .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .filter-checkbox input {
      margin-right: 4px;
    }

    .filter-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
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

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover {
      background: #218838;
    }

    .btn-outline {
      background: white;
      border: 1px solid #e9ecef;
      color: #495057;
    }

    .btn-outline:hover {
      border-color: #28a745;
      color: #28a745;
    }

    .active-filters {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-top: 15px;
    }

    .active-filters-label {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
    }

    .filter-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: #28a745;
      color: white;
      border-radius: 12px;
      font-size: 12px;
    }

    .filter-tag button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      padding: 0 2px;
    }

    .clear-all-filters-btn {
      padding: 4px 8px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 12px;
      cursor: pointer;
      margin-left: auto;
    }

    @media (max-width: 768px) {
      .advanced-search-container {
        padding: 15px;
      }

      .filters-content {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .filter-actions {
        flex-direction: column;
      }

      .active-filters {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .clear-all-filters-btn {
        margin-left: 0;
        align-self: flex-end;
      }
    }
  `]
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  @Input() showQuickFilters = true;
  @Input() showAdvancedFilters = true;
  @Input() placeholder = 'Search products...';

  @Output() search = new EventEmitter<SearchFilters>();
  @Output() quickView = new EventEmitter<Product>();

  searchQuery = '';
  filters: SearchFilters = {
    query: '',
    category: '',
    minPrice: 0,
    maxPrice: 0,
    rating: 0,
    inStock: false
  };

  suggestions: SearchSuggestion[] = [];
  showSuggestions = false;
  highlightedIndex = -1;
  filtersExpanded = false;

  recentSearches: string[] = [];
  popularCategories = ['Madu', 'Minuman', 'Sos', 'Rempah', 'Mee', 'Lain-lain'];

  private searchSubject = new Subject<string>();
  private subscription = new Subscription();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadRecentSearches();
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setupSearchDebounce() {
    this.subscription.add(
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(query => {
        this.generateSuggestions(query);
      })
    );
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.filters.query = query;
    
    if (query.length > 0) {
      this.searchSubject.next(query);
      this.showSuggestions = true;
    } else {
      this.suggestions = [];
      this.filters.query = '';
    }
  }

  onSearchFocus() {
    if (this.searchQuery.length > 0 || this.recentSearches.length > 0) {
      this.showSuggestions = true;
    }
  }

  onSearchBlur() {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.suggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0 && this.suggestions[this.highlightedIndex]) {
          this.selectSuggestion(this.suggestions[this.highlightedIndex]);
        } else {
          this.performSearch();
        }
        break;
      case 'Escape':
        this.closeSuggestions();
        break;
    }
  }

  generateSuggestions(query: string) {
    if (!query) {
      this.suggestions = [];
      return;
    }

    // Mock suggestions - in real app, this would call a service
    const mockSuggestions: SearchSuggestion[] = [
      { text: `${query} products`, type: 'product', count: 15 },
      { text: 'Madu premium', type: 'product', count: 8 },
      { text: 'Sos cili', type: 'product', count: 12 },
      { text: query.includes('madu') ? 'Madu' : 'Minuman', type: 'category', count: 25 }
    ];

    this.suggestions = mockSuggestions.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    );
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    this.searchQuery = suggestion.text;
    this.filters.query = suggestion.text;
    
    if (suggestion.type === 'category') {
      this.filters.category = suggestion.text;
    }
    
    this.closeSuggestions();
    this.performSearch();
  }

  selectRecentSearch(search: string) {
    this.searchQuery = search;
    this.filters.query = search;
    this.closeSuggestions();
    this.performSearch();
  }

  removeRecentSearch(search: string) {
    this.recentSearches = this.recentSearches.filter(s => s !== search);
    this.saveRecentSearches();
  }

  closeSuggestions() {
    this.showSuggestions = false;
    this.highlightedIndex = -1;
  }

  clearSearch() {
    this.searchQuery = '';
    this.filters.query = '';
    this.suggestions = [];
    this.performSearch();
  }

  toggleCategoryFilter(category: string) {
    this.filters.category = this.filters.category === category ? '' : category;
    this.performSearch();
  }

  onFiltersChange() {
    // Auto-apply filters as user changes them
    setTimeout(() => this.performSearch(), 100);
  }

  setRatingFilter(rating: number) {
    this.filters.rating = this.filters.rating === rating ? 0 : rating;
    this.performSearch();
  }

  toggleFiltersExpanded() {
    this.filtersExpanded = !this.filtersExpanded;
  }

  applyFilters() {
    this.performSearch();
  }

  clearAllFilters() {
    this.filters = {
      query: '',
      category: '',
      minPrice: 0,
      maxPrice: 0,
      rating: 0,
      inStock: false
    };
    this.searchQuery = '';
    this.performSearch();
  }

  removeFilter(filterType: string) {
    switch (filterType) {
      case 'query':
        this.filters.query = '';
        this.searchQuery = '';
        break;
      case 'category':
        this.filters.category = '';
        break;
      case 'price':
        this.filters.minPrice = 0;
        this.filters.maxPrice = 0;
        break;
      case 'rating':
        this.filters.rating = 0;
        break;
      case 'inStock':
        this.filters.inStock = false;
        break;
    }
    this.performSearch();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.query ||
      this.filters.category ||
      this.filters.minPrice > 0 ||
      this.filters.maxPrice > 0 ||
      this.filters.rating > 0 ||
      this.filters.inStock
    );
  }

  performSearch() {
    // Add to recent searches if it's a text search
    if (this.filters.query && !this.recentSearches.includes(this.filters.query)) {
      this.recentSearches.unshift(this.filters.query);
      this.recentSearches = this.recentSearches.slice(0, 10); // Keep only 10 recent searches
      this.saveRecentSearches();
    }

    this.search.emit({ ...this.filters });
  }

  private loadRecentSearches() {
    const saved = localStorage.getItem('qurba_recent_searches');
    if (saved) {
      this.recentSearches = JSON.parse(saved);
    }
  }

  private saveRecentSearches() {
    localStorage.setItem('qurba_recent_searches', JSON.stringify(this.recentSearches));
  }

  getSuggestionIcon(type: string): string {
    switch (type) {
      case 'product': return '📦';
      case 'category': return '🏷️';
      case 'brand': return '🏪';
      default: return '🔍';
    }
  }

  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Madu': '🍯',
      'Mee': '🍜',
      'Minuman': '☕',
      'Rempah': '🌶️',
      'Sos': '🥫',
      'Lain-lain': '📦'
    };
    return emojiMap[category] || '📦';
  }

  getStarsDisplay(rating: number): string {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }
} 