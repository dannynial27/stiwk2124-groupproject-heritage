import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // Required for ngModel and ngSubmit
  templateUrl: './feedback-form.html',
  styleUrls: ['./feedback-form.css']
})
export class FeedbackFormComponent {
  feedback = { name: '', email: '', message: '' }; // [Change 1: Define the feedback object with initial properties]
  errorMessage = ''; // [Change 2: Define errorMessage property]

  submitFeedback(): void { // [Change 3: Add submitFeedback method]
    if (!this.feedback.name || !this.feedback.email || !this.feedback.message) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    console.log('Feedback submitted:', this.feedback);
    this.feedback = { name: '', email: '', message: '' }; // Reset form
    this.errorMessage = '';
  }
}
