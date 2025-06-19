import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

// Update the ComparisonProduct interface to include rating and comparedAt
export interface ComparisonProduct extends Product {
  rating?: number;
  comparedAt?: Date; // Add this property
}

@Injectable({
  providedIn: 'root'
})
export class ProductComparisonService {
  private readonly STORAGE_KEY = 'qurba_product_comparison';
  private readonly MAX_COMPARISONS = 4;
  
  private comparisonSubject = new BehaviorSubject<ComparisonProduct[]>([]);
  public comparison$ = this.comparisonSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add a product to comparison
   */
  addToComparison(product: Product): boolean {
    const currentProducts = this.comparisonSubject.value;
    
    // Check if product already exists
    if (this.isInComparison(product.productId)) {
      return false;
    }
    
    // Check if we've reached the maximum
    if (currentProducts.length >= this.MAX_COMPARISONS) {
      return false;
    }
    
    const comparisonProduct: ComparisonProduct = {
      ...product,
      comparedAt: new Date()
    };
    
    const updatedProducts = [...currentProducts, comparisonProduct];
    this.saveToStorage(updatedProducts);
    this.comparisonSubject.next(updatedProducts);
    
    return true;
  }

  /**
   * Remove a product from comparison
   */
  removeFromComparison(productId: number): void {
    const currentProducts = this.comparisonSubject.value;
    const filteredProducts = currentProducts.filter(p => p.productId !== productId);
    
    this.saveToStorage(filteredProducts);
    this.comparisonSubject.next(filteredProducts);
  }

  /**
   * Clear all products from comparison
   */
  clearComparison(): void {
    this.saveToStorage([]);
    this.comparisonSubject.next([]);
  }

  /**
   * Check if a product is in comparison
   */
  isInComparison(productId: number): boolean {
    return this.comparisonSubject.value.some(p => p.productId === productId);
  }

  /**
   * Get products in comparison
   */
  getComparisonProducts(): Observable<ComparisonProduct[]> {
    return this.comparison$;
  }

  /**
   * Get products in comparison synchronously
   */
  getComparisonProductsSync(): ComparisonProduct[] {
    return this.comparisonSubject.value;
  }

  /**
   * Get comparison count
   */
  getComparisonCount(): number {
    return this.comparisonSubject.value.length;
  }

  /**
   * Check if we can add more products
   */
  canAddMore(): boolean {
    return this.comparisonSubject.value.length < this.MAX_COMPARISONS;
  }

  /**
   * Get maximum comparison limit
   */
  getMaxComparisons(): number {
    return this.MAX_COMPARISONS;
  }

  /**
   * Replace a product in comparison
   */
  replaceProduct(oldProductId: number, newProduct: Product): boolean {
    const currentProducts = this.comparisonSubject.value;
    const index = currentProducts.findIndex(p => p.productId === oldProductId);
    
    if (index === -1) {
      return false;
    }
    
    const comparisonProduct: ComparisonProduct = {
      ...newProduct,
      comparedAt: new Date()
    };
    
    const updatedProducts = [...currentProducts];
    updatedProducts[index] = comparisonProduct;
    
    this.saveToStorage(updatedProducts);
    this.comparisonSubject.next(updatedProducts);
    
    return true;
  }

  /**
   * Get comparison analysis
   */
  getComparisonAnalysis(): any {
    const products = this.comparisonSubject.value;
    
    if (products.length < 2) {
      return null;
    }

    const prices = products.map(p => p.price);
    const ratings = products.map(p => p.rating || 0);
    const stocks = products.map(p => p.stockQuantity);

    return {
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        average: prices.reduce((a, b) => a + b, 0) / prices.length
      },
      ratingRange: {
        min: Math.min(...ratings),
        max: Math.max(...ratings),
        average: ratings.reduce((a, b) => a + b, 0) / ratings.length
      },
      stockRange: {
        min: Math.min(...stocks),
        max: Math.max(...stocks),
        total: stocks.reduce((a, b) => a + b, 0)
      },
      categories: [...new Set(products.map(p => p.category))],
      bestValue: this.findBestValue(products),
      highestRated: this.findHighestRated(products),
      lowestPrice: this.findLowestPrice(products)
    };
  }

  private findBestValue(products: ComparisonProduct[]): ComparisonProduct | null {
    // Simple value calculation: rating/price ratio
    let bestValue = products[0];
    let bestRatio = (products[0].rating || 0) / products[0].price;

    for (let i = 1; i < products.length; i++) {
      const ratio = (products[i].rating || 0) / products[i].price;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestValue = products[i];
      }
    }

    return bestValue;
  }

  private findHighestRated(products: ComparisonProduct[]): ComparisonProduct | null {
    return products.reduce((highest, current) => 
      (current.rating || 0) > (highest.rating || 0) ? current : highest
    );
  }

  private findLowestPrice(products: ComparisonProduct[]): ComparisonProduct | null {
    return products.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest
    );
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Convert date strings back to Date objects
        const products = parsed.map((product: any) => ({
          ...product,
          comparedAt: new Date(product.comparedAt)
        }));
        
        this.comparisonSubject.next(products);
      }
    } catch (error) {
      console.error('Error loading comparison products:', error);
      this.comparisonSubject.next([]);
    }
  }

  private saveToStorage(products: ComparisonProduct[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving comparison products:', error);
    }
  }
}