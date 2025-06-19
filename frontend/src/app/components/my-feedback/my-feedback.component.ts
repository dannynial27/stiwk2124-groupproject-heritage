import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-feedback',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './my-feedback.component.html',
  styleUrls: ['./my-feedback.component.css']
})
export class MyFeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  isLoading = true;
  error: string | null = null;

  private feedbackService = inject(FeedbackService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchUserFeedbacks();
  }

  fetchUserFeedbacks(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = "Could not identify user. Please log in again.";
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.feedbackService.getFeedback(userId).subscribe({
      next: (data: any[]) => {
        this.feedbacks = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching user feedbacks:', err);
        this.error = 'Failed to load your feedback history.';
        this.isLoading = false;
      }
    });
  }

  deleteFeedback(feedbackId: number): void {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.feedbackService.deleteFeedback(userId, feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f.feedbackId !== feedbackId);
      },
      error: (err) => {
        console.error('Failed to delete feedback', err);
        alert('There was an error deleting your feedback. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'READ': return 'status-read';
      case 'RESPONDED': return 'status-responded';
      default: return '';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
}
