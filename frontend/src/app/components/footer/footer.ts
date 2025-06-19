import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer mt-auto py-3">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>Ameen Qurba</h5>
            <p>Your trusted source for traditional Malaysian heritage products.</p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/home">Home</a></li>
              <li><a routerLink="/products">Products</a></li>
              <li><a routerLink="/feedback">Feedback</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Contact Us</h5>
            <address>
              Email: <a href="mailto:info&#64;ameenqurba.com">info&#64;ameenqurba.com</a><br>
              Phone: +60 3-1234 5678
            </address>
          </div>
        </div>
        <hr>
        <p class="text-center">© 2024 Ameen Qurba. All Rights Reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #1E3A8A;
      color: white;
      margin-top: 3rem;
    }
    a {
      color: #fff;
      text-decoration: none;
    }
    a:hover {
      color: #ccc;
      text-decoration: underline;
    }
  `]
})
export class FooterComponent {}
