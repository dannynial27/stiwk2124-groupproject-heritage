import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './feedback-form.html',
  styleUrls: ['./feedback-form.css']
})
export class FeedbackFormComponent implements OnInit {
  feedback = { subject: '', content: '' };
  errorMessage = '';
  successMessage = '';
  isAuthenticated = false;
  isLoading = false;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  submitFeedback(): void {
    if (!this.feedback.subject.trim() || !this.feedback.content.trim()) {
      this.errorMessage = 'Subject and message are required.';
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'You must be logged in to submit feedback.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.feedbackService.submitFeedback(userId, this.feedback).subscribe({
      next: () => {
        this.successMessage = 'Thank you for your feedback!';
        this.feedback = { subject: '', content: '' }; // Reset form
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        this.errorMessage = 'Failed to submit feedback. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
