import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { Title } from '@angular/platform-browser';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Ameen Qurba';

  constructor(
    private titleService: Title,
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title + ' - Malaysian Heritage Products');

    // Load initial cart and wishlist data if user is logged in
    if (this.authService.getToken()) {
      this.cartService.loadCart().subscribe();
      this.wishlistService.getWishlist().subscribe();
    }
  }
}
