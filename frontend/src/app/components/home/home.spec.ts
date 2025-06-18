import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, FooterComponent],
      declarations: [HomeComponent],
      providers: [
        { provide: HttpClient, useValue: { get: jasmine.createSpy('get').and.returnValue({ subscribe: () => {} }) } },
        { provide: CartService, useValue: { addToCart: jasmine.createSpy('addToCart') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
