import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackFormComponent } from '../feedback-form/feedback-form'; // [Change 1: Import FeedbackFormComponent]

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FeedbackFormComponent], // [Change 2: Add to imports array]
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  // Component logic
}
