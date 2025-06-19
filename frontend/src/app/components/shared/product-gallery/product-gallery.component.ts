import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../services/image.service';

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  thumbnail: string;
  isMain?: boolean;
}

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-container">
      <!-- Main Image Display -->
      <div class="main-image-container">
        <div class="image-wrapper" 
             (mousemove)="onMouseMove($event)"
             (mouseleave)="onMouseLeave()"
             (mouseenter)="onMouseEnter()"
             #imageWrapper>
          <img 
            [src]="getCurrentImage().url"
            [alt]="getCurrentImage().alt"
            class="main-image"
            [class.zoomed]="isZoomed"
            [style.transform]="zoomTransform"
            (error)="onImageError($event)"
            #mainImage>
          
          <!-- Loading overlay -->
          <div class="loading-overlay" *ngIf="imageLoading">
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          </div>

          <!-- Zoom lens -->
          <div class="zoom-lens" 
               *ngIf="showZoomLens && canZoom"
               [style.left.px]="lensPosition.x"
               [style.top.px]="lensPosition.y">
          </div>

          <!-- Image controls -->
          <div class="image-controls">
            <button 
              class="control-btn zoom-btn"
              [class.active]="isZoomed"
              (click)="toggleZoom()"
              [disabled]="!canZoom"
              title="Toggle Zoom">
              🔍
            </button>
            <button 
              class="control-btn fullscreen-btn"
              (click)="openFullscreen()"
              title="Fullscreen">
              ⛶
            </button>
            <button 
              class="control-btn share-btn"
              (click)="shareImage()"
              title="Share Image">
              📤
            </button>
          </div>

          <!-- Navigation arrows (for multiple images) -->
          <button 
            class="nav-arrow nav-left"
            (click)="previousImage()"
            *ngIf="images.length > 1"
            [disabled]="currentImageIndex === 0"
            title="Previous Image">
            ‹
          </button>
          
          <button 
            class="nav-arrow nav-right"
            (click)="nextImage()"
            *ngIf="images.length > 1"
            [disabled]="currentImageIndex === images.length - 1"
            title="Next Image">
            ›
          </button>
        </div>

        <!-- Image Info -->
        <div class="image-info" *ngIf="showImageInfo">
          <span class="image-counter">{{currentImageIndex + 1}} / {{images.length}}</span>
          <span class="image-description">{{getCurrentImage().alt}}</span>
        </div>
      </div>

      <!-- Thumbnail Strip -->
      <div class="thumbnails-container" *ngIf="images.length > 1">
        <div class="thumbnails-wrapper">
          <button 
            class="thumbnail-nav thumb-nav-left"
            (click)="scrollThumbnails('left')"
            [disabled]="thumbnailScrollIndex === 0"
            *ngIf="images.length > maxVisibleThumbnails">
            ‹
          </button>

          <div class="thumbnails-track" #thumbnailsTrack>
            <div class="thumbnails-strip" [style.transform]="'translateX(' + thumbnailTranslateX + 'px)'">
              <div 
                class="thumbnail-item"
                *ngFor="let image of images; let i = index; trackBy: trackByImageId"
                [class.active]="i === currentImageIndex"
                [class.loading]="thumbnailLoading[i]"
                (click)="selectImage(i)">
                <img 
                  [src]="image.thumbnail || image.url"
                  [alt]="image.alt"
                  class="thumbnail-image"
                  (load)="onThumbnailLoad(i)"
                  (error)="onThumbnailError($event, i)">
                <div class="thumbnail-overlay" *ngIf="thumbnailLoading[i]">
                  <div class="mini-spinner"></div>
                </div>
              </div>
            </div>
          </div>

          <button 
            class="thumbnail-nav thumb-nav-right"
            (click)="scrollThumbnails('right')"
            [disabled]="thumbnailScrollIndex >= images.length - maxVisibleThumbnails"
            *ngIf="images.length > maxVisibleThumbnails">
            ›
          </button>
        </div>
      </div>

      <!-- Zoom View (separate container for zoomed display) -->
      <div class="zoom-view" 
           *ngIf="showZoomView"
           [style.background-image]="'url(' + getCurrentImage().url + ')'"
           [style.background-position]="zoomBackgroundPosition">
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <div class="fullscreen-modal" 
         *ngIf="isFullscreen"
         (click)="closeFullscreen()"
         [@fadeInOut]>
      <div class="fullscreen-content" (click)="$event.stopPropagation()">
        <div class="fullscreen-header">
          <h4>{{getCurrentImage().alt}}</h4>
          <button class="close-btn" (click)="closeFullscreen()">×</button>
        </div>
        
        <div class="fullscreen-image-container">
          <img 
            [src]="getCurrentImage().url"
            [alt]="getCurrentImage().alt"
            class="fullscreen-image">
          
          <!-- Fullscreen navigation -->
          <button 
            class="fullscreen-nav nav-left"
            (click)="previousImage()"
            *ngIf="images.length > 1"
            [disabled]="currentImageIndex === 0">
            ‹
          </button>
          
          <button 
            class="fullscreen-nav nav-right"
            (click)="nextImage()"
            *ngIf="images.length > 1"
            [disabled]="currentImageIndex === images.length - 1">
            ›
          </button>
        </div>
        
        <!-- Fullscreen thumbnails -->
        <div class="fullscreen-thumbnails" *ngIf="images.length > 1">
          <div 
            class="fullscreen-thumbnail"
            *ngFor="let image of images; let i = index"
            [class.active]="i === currentImageIndex"
            (click)="selectImage(i)">
            <img [src]="image.thumbnail || image.url" [alt]="image.alt">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery-container {
      position: relative;
      user-select: none;
    }

    .main-image-container {
      position: relative;
      margin-bottom: 15px;
    }

    .image-wrapper {
      position: relative;
      background: #f8f9fa;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 1;
      max-height: 500px;
      cursor: crosshair;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
      display: block;
    }

    .main-image.zoomed {
      cursor: move;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(248, 249, 250, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e9ecef;
      border-top: 3px solid #28a745;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .zoom-lens {
      position: absolute;
      width: 100px;
      height: 100px;
      border: 2px solid #28a745;
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      background: rgba(40, 167, 69, 0.1);
      z-index: 3;
    }

    .image-controls {
      position: absolute;
      top: 15px;
      right: 15px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 4;
    }

    .control-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .control-btn:hover:not(:disabled) {
      background: white;
      transform: scale(1.1);
    }

    .control-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .control-btn.active {
      background: #28a745;
      color: white;
    }

    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 4;
      backdrop-filter: blur(10px);
    }

    .nav-arrow:hover:not(:disabled) {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .nav-arrow:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .nav-left {
      left: 15px;
    }

    .nav-right {
      right: 15px;
    }

    .image-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      font-size: 14px;
      color: #666;
    }

    .image-counter {
      font-weight: 500;
    }

    .thumbnails-container {
      margin-top: 15px;
    }

    .thumbnails-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .thumbnail-nav {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      color: #666;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .thumbnail-nav:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #28a745;
      color: #28a745;
    }

    .thumbnail-nav:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .thumb-nav-left {
      margin-right: 10px;
    }

    .thumb-nav-right {
      margin-left: 10px;
    }

    .thumbnails-track {
      overflow: hidden;
      flex: 1;
    }

    .thumbnails-strip {
      display: flex;
      gap: 8px;
      transition: transform 0.3s ease;
    }

    .thumbnail-item {
      position: relative;
      flex: 0 0 80px;
      height: 80px;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .thumbnail-item:hover {
      border-color: #28a745;
      transform: translateY(-2px);
    }

    .thumbnail-item.active {
      border-color: #28a745;
      box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }

    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(248, 249, 250, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mini-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #e9ecef;
      border-top: 2px solid #28a745;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .zoom-view {
      position: absolute;
      top: 0;
      right: -320px;
      width: 300px;
      height: 300px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-repeat: no-repeat;
      background-size: 200% 200%;
      z-index: 5;
    }

    .fullscreen-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .fullscreen-content {
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .fullscreen-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .fullscreen-header h4 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      width: 30px;
      height: 30px;
      border: none;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }

    .fullscreen-image-container {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 400px;
    }

    .fullscreen-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .fullscreen-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .fullscreen-nav.nav-left {
      left: 20px;
    }

    .fullscreen-nav.nav-right {
      right: 20px;
    }

    .fullscreen-thumbnails {
      display: flex;
      gap: 10px;
      padding: 20px;
      justify-content: center;
      border-top: 1px solid #e9ecef;
      max-width: 100%;
      overflow-x: auto;
    }

    .fullscreen-thumbnail {
      flex: 0 0 60px;
      height: 60px;
      border: 2px solid transparent;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .fullscreen-thumbnail:hover {
      border-color: #28a745;
    }

    .fullscreen-thumbnail.active {
      border-color: #28a745;
    }

    .fullscreen-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeInOut {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .image-controls {
        top: 10px;
        right: 10px;
      }

      .control-btn {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }

      .nav-arrow {
        width: 35px;
        height: 35px;
        font-size: 18px;
      }

      .nav-left {
        left: 10px;
      }

      .nav-right {
        right: 10px;
      }

      .zoom-view {
        display: none; /* Hide zoom view on mobile */
      }

      .thumbnail-item {
        flex: 0 0 60px;
        height: 60px;
      }

      .fullscreen-nav {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }

      .fullscreen-thumbnails {
        padding: 15px;
      }

      .fullscreen-thumbnail {
        flex: 0 0 50px;
        height: 50px;
      }
    }
  `]
})
export class ProductGalleryComponent implements OnInit, OnChanges {
  @Input() images: ProductImage[] = [];
  @Input() showImageInfo: boolean = true;
  @Input() maxVisibleThumbnails: number = 6;
  @Input() enableZoom: boolean = true;
  @Input() showZoomView: boolean = false;

  @ViewChild('mainImage') mainImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('imageWrapper') imageWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('thumbnailsTrack') thumbnailsTrackRef!: ElementRef<HTMLDivElement>;

  currentImageIndex = 0;
  imageLoading = false;
  thumbnailLoading: boolean[] = [];
  
  // Zoom functionality
  isZoomed = false;
  canZoom = true;
  showZoomLens = false;
  zoomTransform = '';
  zoomBackgroundPosition = '0% 0%';
  lensPosition = { x: 0, y: 0 };
  
  // Thumbnail navigation
  thumbnailScrollIndex = 0;
  thumbnailTranslateX = 0;
  thumbnailItemWidth = 88; // 80px + 8px gap
  
  // Fullscreen
  isFullscreen = false;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      this.initializeComponent();
    }
  }

  initializeComponent() {
    this.currentImageIndex = 0;
    this.thumbnailLoading = new Array(this.images.length).fill(false);
    this.resetZoom();
    this.resetThumbnailScroll();
  }

  getCurrentImage(): ProductImage {
    return this.images[this.currentImageIndex] || { 
      id: 0, 
      url: 'http://localhost:8080/qurba/api/images/product/default', 
      alt: 'Product Image', 
      thumbnail: 'http://localhost:8080/qurba/api/images/product/default' 
    };
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
      this.resetZoom();
      this.imageLoading = true;
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.selectImage(this.currentImageIndex - 1);
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.selectImage(this.currentImageIndex + 1);
    }
  }

  // Zoom functionality
  toggleZoom() {
    if (!this.canZoom) return;
    this.isZoomed = !this.isZoomed;
    if (!this.isZoomed) {
      this.resetZoom();
    }
  }

  onMouseEnter() {
    if (this.enableZoom && this.canZoom) {
      this.showZoomLens = true;
    }
  }

  onMouseLeave() {
    this.showZoomLens = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.enableZoom || !this.canZoom) return;

    const wrapper = this.imageWrapperRef.nativeElement;
    const rect = wrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update lens position
    this.lensPosition = { x, y };

    // Calculate zoom transform
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    if (this.isZoomed) {
      this.zoomTransform = `scale(2) translate(${25 - xPercent / 2}%, ${25 - yPercent / 2}%)`;
    }

    // Update zoom view background position
    this.zoomBackgroundPosition = `${xPercent}% ${yPercent}%`;
  }

  resetZoom() {
    this.isZoomed = false;
    this.showZoomLens = false;
    this.zoomTransform = '';
    this.zoomBackgroundPosition = '0% 0%';
  }

  // Thumbnail navigation
  scrollThumbnails(direction: 'left' | 'right') {
    if (direction === 'left' && this.thumbnailScrollIndex > 0) {
      this.thumbnailScrollIndex--;
    } else if (direction === 'right' && this.thumbnailScrollIndex < this.images.length - this.maxVisibleThumbnails) {
      this.thumbnailScrollIndex++;
    }
    
    this.thumbnailTranslateX = -this.thumbnailScrollIndex * this.thumbnailItemWidth;
  }

  resetThumbnailScroll() {
    this.thumbnailScrollIndex = 0;
    this.thumbnailTranslateX = 0;
  }

  // Fullscreen functionality
  openFullscreen() {
    this.isFullscreen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    this.isFullscreen = false;
    document.body.style.overflow = '';
  }

  // Event handlers
  onImageError(event: any) {
    event.target.src = 'http://localhost:8080/qurba/api/images/product/default';
    this.imageLoading = false;
    this.canZoom = false;
  }

  onThumbnailLoad(index: number) {
    this.thumbnailLoading[index] = false;
  }

  onThumbnailError(event: any, index: number) {
    event.target.src = 'http://localhost:8080/qurba/api/images/product/default';
    this.thumbnailLoading[index] = false;
  }

  shareImage() {
    const currentImage = this.getCurrentImage();
    if (navigator.share) {
      navigator.share({
        title: 'Product Image',
        text: currentImage.alt,
        url: currentImage.url
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentImage.url).then(() => {
        console.log('Image URL copied to clipboard');
      }).catch(console.error);
    }
  }

  trackByImageId(index: number, image: ProductImage): number {
    return image.id;
  }

  getImageUrl(imagePath?: string): string {
    return this.imageService.getProductImageUrl(imagePath);
  }
} 