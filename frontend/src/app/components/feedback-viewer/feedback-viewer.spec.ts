import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackViewer } from './feedback-viewer';

describe('FeedbackViewer', () => {
  let component: FeedbackViewer;
  let fixture: ComponentFixture<FeedbackViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
