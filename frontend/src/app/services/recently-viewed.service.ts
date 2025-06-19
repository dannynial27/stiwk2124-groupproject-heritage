import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface RecentlyViewedItem {
  product: Product;
  viewedAt: Date;
  viewCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'qurba_recently_viewed';
  private readonly MAX_ITEMS = 20;
  
  private recentlyViewedSubject = new BehaviorSubject<RecentlyViewedItem[]>([]);
  public recentlyViewed$ = this.recentlyViewedSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add a product to recently viewed list
   */
  addProduct(product: Product): void {
    const currentItems = this.recentlyViewedSubject.value;
    
    // Check if product already exists
    const existingIndex = currentItems.findIndex(item => item.product.productId === product.productId);
    
    if (existingIndex >= 0) {
      // Update existing item
      const existingItem = currentItems[existingIndex];
      existingItem.viewedAt = new Date();
      existingItem.viewCount += 1;
      
      // Move to front
      currentItems.splice(existingIndex, 1);
      currentItems.unshift(existingItem);
    } else {
      // Add new item at the front
      const newItem: RecentlyViewedItem = {
        product: { ...product },
        viewedAt: new Date(),
        viewCount: 1
      };
      
      currentItems.unshift(newItem);
      
      // Limit the number of items
      if (currentItems.length > this.MAX_ITEMS) {
        currentItems.splice(this.MAX_ITEMS);
      }
    }
    
    this.saveToStorage(currentItems);
    this.recentlyViewedSubject.next([...currentItems]);
  }

  /**
   * Get recently viewed products
   */
  getRecentlyViewed(): Observable<RecentlyViewedItem[]> {
    return this.recentlyViewed$;
  }

  /**
   * Get recently viewed products synchronously
   */
  getRecentlyViewedSync(): RecentlyViewedItem[] {
    return this.recentlyViewedSubject.value;
  }

  /**
   * Get recent products for a specific category
   */
  getRecentByCategory(category: string, limit: number = 5): RecentlyViewedItem[] {
    return this.recentlyViewedSubject.value
      .filter(item => item.product.category === category)
      .slice(0, limit);
  }

  /**
   * Get most viewed products
   */
  getMostViewed(limit: number = 10): RecentlyViewedItem[] {
    return [...this.recentlyViewedSubject.value]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }

  /**
   * Remove a product from recently viewed
   */
  removeProduct(productId: number): void {
    const currentItems = this.recentlyViewedSubject.value;
    const filteredItems = currentItems.filter(item => item.product.productId !== productId);
    
    this.saveToStorage(filteredItems);
    this.recentlyViewedSubject.next(filteredItems);
  }

  /**
   * Clear all recently viewed products
   */
  clearAll(): void {
    this.saveToStorage([]);
    this.recentlyViewedSubject.next([]);
  }

  /**
   * Get products viewed in the last N days
   */
  getRecentByDays(days: number, limit?: number): RecentlyViewedItem[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filtered = this.recentlyViewedSubject.value
      .filter(item => new Date(item.viewedAt) >= cutoffDate);
    
    return limit ? filtered.slice(0, limit) : filtered;
  }

  /**
   * Check if a product was recently viewed
   */
  isRecentlyViewed(productId: number): boolean {
    return this.recentlyViewedSubject.value.some(item => item.product.productId === productId);
  }

  /**
   * Get view count for a specific product
   */
  getProductViewCount(productId: number): number {
    const item = this.recentlyViewedSubject.value.find(item => item.product.productId === productId);
    return item ? item.viewCount : 0;
  }

  /**
   * Get personalized recommendations based on viewing history
   */
  getPersonalizedRecommendations(limit: number = 6): Product[] {
    const recentItems = this.recentlyViewedSubject.value;
    
    if (recentItems.length === 0) {
      return [];
    }

    // Analyze viewing patterns
    const categoryPreferences = this.analyzeCategoryPreferences(recentItems);
    const priceRangePreferences = this.analyzePriceRanges(recentItems);
    
    // Generate recommendations based on preferences
    // In a real app, this would make an API call with user preferences
    return this.generateRecommendations(categoryPreferences, priceRangePreferences, limit);
  }

  private analyzeCategoryPreferences(items: RecentlyViewedItem[]): { [category: string]: number } {
    const preferences: { [category: string]: number } = {};
    
    items.forEach(item => {
      const category = item.product.category;
      if (preferences[category]) {
        preferences[category] += item.viewCount;
      } else {
        preferences[category] = item.viewCount;
      }
    });
    
    return preferences;
  }

  private analyzePriceRanges(items: RecentlyViewedItem[]): { min: number; max: number } {
    const prices = items.map(item => item.product.price);
    return {
      min: Math.min(...prices) * 0.8, // 20% below minimum
      max: Math.max(...prices) * 1.2  // 20% above maximum
    };
  }

  private generateRecommendations(
    categoryPreferences: { [category: string]: number },
    priceRange: { min: number; max: number },
    limit: number
  ): Product[] {
    // This is a simplified recommendation system
    // In a real app, this would be handled by the backend with ML algorithms
    
    const recommendations: Product[] = [];
    const viewedProductIds = this.recentlyViewedSubject.value.map(item => item.product.productId);
    
    // Sort categories by preference
    const sortedCategories = Object.entries(categoryPreferences)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // For demo purposes, return placeholder recommendations
    // In real implementation, this would query the product service with filters
    
    return recommendations.slice(0, limit);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Convert date strings back to Date objects
        const items = parsed.map((item: any) => ({
          ...item,
          viewedAt: new Date(item.viewedAt)
        }));
        
        this.recentlyViewedSubject.next(items);
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
      this.recentlyViewedSubject.next([]);
    }
  }

  private saveToStorage(items: RecentlyViewedItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving recently viewed products:', error);
    }
  }
} 