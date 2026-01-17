import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../cart.service';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  total = 0;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) return;

    this.refresh();
  }

  private refresh(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  increase(gameId: string): void {
    this.cartService.increaseQty(gameId);
    this.refresh();
  }

  decrease(gameId: string): void {
    this.cartService.decreaseQty(gameId);
    this.refresh();
  }

  remove(gameId: string): void {
    this.cartService.removeFromCart(gameId);
    this.refresh();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.refresh();
  }

  checkout(): void {
    // placeholder for now
    alert('Checkout coming soon!');
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
