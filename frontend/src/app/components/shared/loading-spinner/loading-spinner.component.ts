import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size">
        <div class="spinner-border" [style.border-width.px]="borderWidth"></div>
      </div>
      <p *ngIf="message" class="spinner-message">{{message}}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .spinner-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }
    
    .spinner {
      display: inline-block;
      position: relative;
    }
    
    .spinner-border {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: solid transparent;
      border-top-color: #28a745;
      border-right-color: #28a745;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .spinner-message {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() borderWidth: number = 4;
  @Input() message?: string;
  @Input() overlay: boolean = false;
} 