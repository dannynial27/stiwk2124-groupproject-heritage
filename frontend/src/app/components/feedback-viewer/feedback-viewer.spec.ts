import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackViewerComponent } from './feedback-viewer';
import { FeedbackService } from '../../services/feedback.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer';
import { RouterModule } from '@angular/router';

describe('FeedbackViewerComponent', () => {
  let component: FeedbackViewerComponent;
  let fixture: ComponentFixture<FeedbackViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, FooterComponent],
      declarations: [FeedbackViewerComponent],
      providers: [
        { provide: FeedbackService, useValue: { getFeedbacks: jasmine.createSpy('getFeedbacks').and.returnValue({ subscribe: () => {} }) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
