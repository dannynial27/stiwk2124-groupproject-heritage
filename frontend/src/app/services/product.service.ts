import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/qurba/api/products';
  private adminApiUrl = 'http://localhost:8080/qurba/api/admin/products';
  
  constructor(
    private http: HttpClient,
    private imageService: ImageService
  ) { }
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.map(product => this.processProductImage(product))),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]); // Return empty array on error
      })
    );
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.processProductImage(product))
    );
  }
  
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.adminApiUrl, product);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.adminApiUrl}/${id}`, product);
  }
  
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }
  
  // Search, filter, sort methods
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?query=${query}`).pipe(
      map(products => products.map(product => this.processProductImage(product)))
    );
  }
  
  filterByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/filter?category=${category}`).pipe(
      map(products => products.map(product => this.processProductImage(product)))
    );
  }
  
  sortByPrice(order: 'asc' | 'desc'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/sort?sortOrder=${order}`).pipe(
      map(products => products.map(product => this.processProductImage(product)))
    );
  }
  
  getCategories(): Observable<string[]> {
    // Since there's no actual endpoint for categories in the documentation,
    // we'll hardcode them as per the Documentation
    return of(['Madu', 'Mee', 'Minuman', 'Rempah', 'Sos', 'Lain-lain']);
  }
  
  // Admin-specific category methods (these would need actual API endpoints)
  addCategory(category: string): Observable<any> {
    // This would typically call an API endpoint to add a category
    return of({ success: true, category });
  }
  
  deleteCategory(category: string): Observable<any> {
    // This would typically call an API endpoint to delete a category
    return of({ success: true });
  }
  
  // Helper methods for image handling
  private processProductImage(product: Product): Product {
    if (product.imagePath) {
      product.imagePath = this.imageService.convertToApiUrl(product.imagePath);
    } else {
      product.imagePath = '/api/images/product/default';
    }
    return product;
  }

  getAllProducts(): Observable<Product[]> {
    return this.getProducts();
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.filterByCategory(category);
  }

  createProduct(product: Product): Observable<Product> {
    return this.addProduct(product);
  }
}
