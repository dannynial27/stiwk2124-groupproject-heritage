import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackFormComponent } from './feedback-form';
import { FeedbackService } from '../../services/feedback.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

describe('FeedbackFormComponent', () => {
  let component: FeedbackFormComponent;
  let fixture: ComponentFixture<FeedbackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule],
      declarations: [FeedbackFormComponent],
      providers: [
        { provide: FeedbackService, useValue: { submitFeedback: jasmine.createSpy('submitFeedback').and.returnValue({ subscribe: () => {} }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
