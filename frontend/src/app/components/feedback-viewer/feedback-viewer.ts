import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-feedback-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, FormsModule],
  templateUrl: './feedback-viewer.html',
  styleUrls: ['./feedback-viewer.css']
})
export class FeedbackViewerComponent implements OnInit {
  feedbacks: any[] = [];
  filteredFeedbacks: any[] = [];
  isLoading = true;
  error: string | null = null;

  currentFilter: 'ALL' | 'PENDING' | 'READ' | 'RESPONDED' = 'ALL';

  selectedFeedback: any = null;
  adminResponse = '';
  isResponding = false;

  private feedbackService = inject(FeedbackService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.getRole() !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchFeedbacks();
  }

  fetchFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getFeedbacks().subscribe({
      next: (data: any[]) => {
        this.feedbacks = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching feedbacks:', err);
        this.error = 'Failed to load feedback.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(filter: 'ALL' | 'PENDING' | 'READ' | 'RESPONDED' = this.currentFilter): void {
    this.currentFilter = filter;
    if (filter === 'ALL') {
      this.filteredFeedbacks = this.feedbacks;
    } else {
      this.filteredFeedbacks = this.feedbacks.filter(f => f.status === filter);
    }
  }

  markAsRead(feedback: any): void {
    if (feedback.status === 'PENDING') {
      this.feedbackService.markAsRead(feedback.feedbackId).subscribe({
        next: (updatedFeedback) => {
          const index = this.feedbacks.findIndex(f => f.feedbackId === updatedFeedback.feedbackId);
          if (index !== -1) {
            this.feedbacks[index] = updatedFeedback;
            this.applyFilter();
          }
        },
        error: (err) => console.error('Failed to mark as read', err)
      });
    }
  }

  selectForResponse(feedback: any): void {
    this.selectedFeedback = feedback;
    this.adminResponse = '';
  }

  cancelResponse(): void {
    this.selectedFeedback = null;
    this.adminResponse = '';
  }

  submitResponse(): void {
    if (!this.adminResponse.trim() || !this.selectedFeedback) {
      return;
    }
    this.isResponding = true;
    this.feedbackService.respondToFeedback(this.selectedFeedback.feedbackId, this.adminResponse).subscribe({
      next: (updatedFeedback) => {
        const index = this.feedbacks.findIndex(f => f.feedbackId === updatedFeedback.feedbackId);
        if (index !== -1) {
          this.feedbacks[index] = updatedFeedback;
          this.applyFilter();
        }
        this.cancelResponse();
      },
      error: (err) => {
        console.error('Failed to submit response', err);
        alert('Failed to submit response.');
      },
      complete: () => {
        this.isResponding = false;
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

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
}
