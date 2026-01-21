import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  isOpen = false;
  cartCount = 0;

  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    public userService: UserService
  ) {
    this.cartCount = this.cartService.getItemsCount();

    this.sub = this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getItemsCount();
    });
  }

  toggleDropdown(): void { this.isOpen = !this.isOpen; }
  closeDropdown(): void { this.isOpen = false; }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
