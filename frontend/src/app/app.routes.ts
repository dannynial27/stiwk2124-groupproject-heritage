import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form';
import { FeedbackViewerComponent } from './components/feedback-viewer/feedback-viewer';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feedback', component: FeedbackFormComponent },
  { path: 'feedback-viewer', component: FeedbackViewerComponent }
];
