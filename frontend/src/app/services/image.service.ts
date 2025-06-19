import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  // Base URL for API requests
  public apiUrl = 'http://localhost:8080/qurba/api';
  
  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }
  
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
      `${this.apiUrl}/images/upload`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }
  
  /**
   * Get product image URL directly from path stored in database
   * This handles paths in the format "assets/QurbaProductPhoto/{category}/{productName}.png"
   */
  getProductImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return this.getDefaultImageUrl();
    }
    
    try {
      // If it's already an API URL, return it as is
      if (imagePath.startsWith('http') || imagePath.startsWith('/api/')) {
        return imagePath;
      }
      
      // Convert database path format to API URL format
      if (imagePath.includes('QurbaProductPhoto')) {
        const parts = imagePath.split('/');
        if (parts.length >= 3) {
          const category = parts[parts.length - 2];
          const filename = parts[parts.length - 1];
          return `${this.apiUrl}/images/product/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`;
        }
      }
      
      // Fallback to default if we can't parse the path
      return this.getDefaultImageUrl();
    } catch (error) {
      console.error('Error processing image path:', error);
      return this.getDefaultImageUrl();
    }
  }
  
  /**
   * Get a safe URL for image with proper error handling
   */
  getSafeProductImageUrl(imagePath?: string): SafeUrl {
    const url = this.getProductImageUrl(imagePath);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  /**
   * Get product image by category and name directly
   */
  getProductImageByName(category: string, productName: string): string {
    if (!category || !productName) {
      return this.getDefaultImageUrl();
    }
    
    const filename = this.ensurePngExtension(this.normalizeFilename(productName));
    return `${this.apiUrl}/images/product/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`;
  }
  
  /**
   * Get default image URL
   */
  getDefaultImageUrl(): string {
    return `${this.apiUrl}/images/product/default`;
  }
  
  /**
   * Ensure filename has .png extension
   */
  private ensurePngExtension(filename: string): string {
    if (!filename) return 'unknown.png';
    return filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`;
  }
  
  /**
   * Normalize filename for URL (remove spaces, special chars)
   */
  private normalizeFilename(name: string): string {
    return name.replace(/[^\w-]/g, '-').toLowerCase();
  }
  
  /**
   * Convert database image path to API URL
   */
  convertToApiUrl(dbPath: string): string {
    return this.getProductImageUrl(dbPath);
  }
}