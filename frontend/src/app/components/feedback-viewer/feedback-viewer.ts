import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-feedback-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './feedback-viewer.html',
  styleUrls: ['./feedback-viewer.css']
})
export class FeedbackViewerComponent implements OnInit {
  feedbacks: any[] = [];

  private feedbackService = inject(FeedbackService);
  private router = inject(Router);

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      alert('Only admins can view feedback. Please login as admin.');
      this.router.navigate(['/admin-login']);
      return;
    }
    this.fetchFeedbacks();
  }

  fetchFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe({
      next: (data: any) => this.feedbacks = data,
      error: (err: any) => {
        console.error('Error fetching feedbacks:', err);
        this.feedbacks = [];
      }
    });
  }
}
