import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './userService.service';
import { User } from './modules/users';

export type CartItem = {
  gameId: string;     // use string to support ids like "fdd4"
  title: string;
  price: number;
  image?: string;
  qty: number;
};

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private dataUrl = 'http://localhost:3001/users';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  /* =============================
     GET CART
     ============================= */
  getCart(): CartItem[] {
    const user = this.userService.getCurrentUser() as (User & { cart?: CartItem[] }) | null;
    if (!user) return [];
    if (!user.cart) user.cart = [];
    return user.cart;
  }

  /* =============================
     IS IN CART
     ============================= */
  isInCart(gameId: string): boolean {
    return this.getCart().some(i => i.gameId === gameId);
  }

  /* =============================
     ADD TO CART
     ============================= */
  addToCart(item: Omit<CartItem, 'qty'>, qty: number = 1): boolean {
    const user = this.userService.getCurrentUser() as (User & { cart?: CartItem[] }) | null;
    if (!user) return false;

    if (!user.cart) user.cart = [];

    const existing = user.cart.find(i => i.gameId === item.gameId);
    if (existing) {
      existing.qty += qty;
    } else {
      user.cart.push({ ...item, qty });
    }

    this.saveCart(user.id, user.cart);
    return true;
  }

  /* =============================
     UPDATE QTY
     ============================= */
  updateQty(gameId: string, qty: number): boolean {
    const user = this.userService.getCurrentUser() as (User & { cart?: CartItem[] }) | null;
    if (!user) return false;

    if (!user.cart) user.cart = [];

    const item = user.cart.find(i => i.gameId === gameId);
    if (!item) return false;

    if (qty <= 0) {
      return this.removeFromCart(gameId);
    }

    item.qty = qty;
    this.saveCart(user.id, user.cart);
    return true;
  }

  increaseQty(gameId: string): boolean {
    const cart = this.getCart();
    const item = cart.find(i => i.gameId === gameId);
    if (!item) return false;
    return this.updateQty(gameId, item.qty + 1);
  }

  decreaseQty(gameId: string): boolean {
    const cart = this.getCart();
    const item = cart.find(i => i.gameId === gameId);
    if (!item) return false;
    return this.updateQty(gameId, item.qty - 1);
  }

  /* =============================
     REMOVE ITEM
     ============================= */
  removeFromCart(gameId: string): boolean {
    const user = this.userService.getCurrentUser() as (User & { cart?: CartItem[] }) | null;
    if (!user) return false;

    const cart = this.getCart().filter(i => i.gameId !== gameId);
    user.cart = cart;

    this.saveCart(user.id, cart);
    return true;
  }

  /* =============================
     CLEAR CART
     ============================= */
  clearCart(): boolean {
    const user = this.userService.getCurrentUser() as (User & { cart?: CartItem[] }) | null;
    if (!user) return false;

    user.cart = [];
    this.saveCart(user.id, []);
    return true;
  }

  /* =============================
     TOTAL
     ============================= */
  getTotal(): number {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  getCount(): number {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  /* =============================
     SAVE TO users.json
     ============================= */
  private saveCart(userId: number, cart: CartItem[]): void {
    this.http
      .patch(`${this.dataUrl}/${userId}`, { cart })
      .subscribe({
        error: (err) => console.error('PATCH cart failed:', err)
      });
  }
}
