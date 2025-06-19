import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [class.interactive]="interactive">
      <span 
        *ngFor="let star of stars; let i = index" 
        class="star"
        [class.filled]="i < rating"
        [class.half]="i === Math.floor(rating) && rating % 1 !== 0"
        (click)="onStarClick(i + 1)"
        (mouseenter)="onStarHover(i + 1)"
        (mouseleave)="onMouseLeave()">
        ★
      </span>
      <span class="rating-text" *ngIf="showText">
        {{rating.toFixed(1)}} <span *ngIf="reviewCount">({{reviewCount}} reviews)</span>
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    
    .star {
      font-size: 20px;
      color: #ddd;
      transition: color 0.2s;
      cursor: default;
    }
    
    .star.filled {
      color: #ffc107;
    }
    
    .star.half {
      background: linear-gradient(90deg, #ffc107 50%, #ddd 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .interactive .star {
      cursor: pointer;
    }
    
    .interactive .star:hover {
      color: #ffc107;
    }
    
    .rating-text {
      margin-left: 8px;
      font-size: 14px;
      color: #666;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() maxStars: number = 5;
  @Input() interactive: boolean = false;
  @Input() showText: boolean = false;
  @Input() reviewCount?: number;
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [];
  hoverRating: number = 0;
  Math = Math;

  ngOnInit() {
    this.stars = Array(this.maxStars).fill(0).map((_, i) => i + 1);
  }

  onStarClick(rating: number) {
    if (this.interactive) {
      this.rating = rating;
      this.ratingChange.emit(rating);
    }
  }

  onStarHover(rating: number) {
    if (this.interactive) {
      this.hoverRating = rating;
    }
  }

  onMouseLeave() {
    this.hoverRating = 0;
  }

  get displayRating() {
    return this.hoverRating || this.rating;
  }
} 