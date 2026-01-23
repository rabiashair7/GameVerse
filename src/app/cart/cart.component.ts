import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../cart.service';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  total = 0;
  isLoggedIn = false;

  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) return;

    this.refresh();

    this.sub = this.cartService.cart$.subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private refresh(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  increase(gameId: string): void {
    this.cartService.increaseQty(gameId);
  }

  decrease(gameId: string): void {
    this.cartService.decreaseQty(gameId);
  }

  remove(gameId: string): void {
    this.cartService.removeFromCart(gameId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.cartItems.length) {
      alert('Your cart is empty.');
      return;
    }

    for (const item of this.cartItems) {
      this.userService.addToLibrary(String(item.gameId));
    }

    this.clearCart();
    this.refresh();

    alert('✅ Purchased! Games added to your Library.');
    this.router.navigate(['/library']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
