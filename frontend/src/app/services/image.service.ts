import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8080/qurba/api/images';
  
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  /**
   * Upload a product image
   */
  uploadProductImage(file: File, category: string, productName: string, replace: boolean = false): Observable<{ imagePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('productName', productName);
    formData.append('replace', replace.toString());
    
    return this.http.post<{ imagePath: string }>(
      `${this.apiUrl}/upload`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }
  
  /**
   * Get the URL for a product image
   */
  getProductImageUrl(category: string, productName: string): string {
    // Normalize product name for URL (remove spaces, lowercase)
    const normalizedName = productName.replace(/\s+/g, '-').toLowerCase();
    return `${this.apiUrl}/product/${category}/${normalizedName}.png`;
  }
  
  /**
   * Get a safe product image URL with fallback to default
   */
  getSafeProductImageUrl(category: string, productName: string): string {
    try {
      if (!category || !productName) {
        return `${this.apiUrl}/product/default`;
      }
      return this.getProductImageUrl(category, productName);
    } catch (error) {
      console.error('Error generating image URL:', error);
      return `${this.apiUrl}/product/default`;
    }
  }
  
  /**
   * Convert database image path to API URL
   */
  convertToApiUrl(dbPath: string): string {
    if (!dbPath) {
      return `${this.apiUrl}/product/default`;
    }
    
    // Handle paths in the format "assets/QurbaProductPhoto/{category}/{productName}.png"
    if (dbPath.startsWith('assets/QurbaProductPhoto/')) {
      const parts = dbPath.split('/');
      if (parts.length >= 3) {
        const category = parts[2];
        const filename = parts[3] || '';
        return `${this.apiUrl}/product/${category}/${filename}`;
      }
    }
    
    // If already in API format, return as is
    if (dbPath.startsWith(`${this.apiUrl}/product/`)) {
      return dbPath;
    }
    
    // Default fallback
    return `${this.apiUrl}/product/default`;
  }
}