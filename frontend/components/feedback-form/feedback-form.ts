import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { FooterComponent } from '../footer/footer'; // Added import

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent], // Added FooterComponent
  templateUrl: './feedback-form.html',
  styleUrls: ['./feedback-form.css']
})
export class FeedbackFormComponent {
  feedback = {
    name: '',
    email: '',
    message: ''
  };
  errorMessage: string = '';

  private feedbackService = inject(FeedbackService);

  submitFeedback() {
    if (!this.validateForm()) return;
    this.feedbackService.submitFeedback(this.feedback).subscribe({
      next: () => {
        alert('Thank you for your feedback!');
        this.feedback = { name: '', email: '', message: '' };
      },
      error: (err: any) => {
        console.error('Error submitting feedback:', err);
        this.errorMessage = 'Failed to submit feedback. Please try again.';
      }
    });
  }

  validateForm(): boolean {
    if (!this.feedback.name || !/^[a-zA-Z\s]+$/.test(this.feedback.name)) {
      this.errorMessage = 'Name must contain only letters.';
      return false;
    }
    if (!this.feedback.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.feedback.email)) {
      this.errorMessage = 'Please enter a valid email.';
      return false;
    }
    if (!this.feedback.message || this.feedback.message.length < 10) {
      this.errorMessage = 'Message must be at least 10 characters long.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
}
