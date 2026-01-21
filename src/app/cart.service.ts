// ✅ src/app/cart.service.ts  (FULL - LIVE)
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  gameId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'gv_cart';

  private cartSubject = new BehaviorSubject<CartItem[]>(this.readFromStorage());
  cart$ = this.cartSubject.asObservable();

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private setCart(items: CartItem[]): void {
    this.saveToStorage(items);
    this.cartSubject.next(items); // ✅ LIVE update
  }

  private normId(id: string): string {
    return String(id).trim();
  }

  // ---------- API ----------
  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return sum + price * qty;
    }, 0);
  }

  increaseQty(gameId: string): void {
    const id = this.normId(gameId);
    const cart = [...this.cartSubject.value];
    const idx = cart.findIndex(x => this.normId(x.gameId) === id);
    if (idx === -1) return;

    cart[idx] = { ...cart[idx], qty: cart[idx].qty + 1 };
    this.setCart(cart);
  }

  decreaseQty(gameId: string): void {
    const id = this.normId(gameId);
    const cart = [...this.cartSubject.value];
    const idx = cart.findIndex(x => this.normId(x.gameId) === id);
    if (idx === -1) return;

    const newQty = cart[idx].qty - 1;

    if (newQty <= 0) {
      this.setCart(cart.filter(x => this.normId(x.gameId) !== id));
      return;
    }

    cart[idx] = { ...cart[idx], qty: newQty };
    this.setCart(cart);
  }

  removeFromCart(gameId: string): void {
    const id = this.normId(gameId);
    this.setCart(this.cartSubject.value.filter(x => this.normId(x.gameId) !== id));
  }

  clearCart(): void {
    this.setCart([]);
  }

  addToCart(
    item: { gameId: string; title: string; price: number; image: string },
    qty: number = 1
  ): void {
    const id = this.normId(item.gameId);
    const safeQty = Math.max(1, Math.floor(qty || 1));

    const cart = [...this.cartSubject.value];
    const idx = cart.findIndex(x => this.normId(x.gameId) === id);

    if (idx >= 0) {
      cart[idx] = { ...cart[idx], qty: cart[idx].qty + safeQty };
    } else {
      cart.push({
        gameId: id,
        title: item.title,
        price: Number(item.price) || 0,
        image: item.image || '',
        qty: safeQty
      });
    }

    this.setCart(cart);
  }

  getItemsCount(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }

  isInCart(gameId: string): boolean {
    const id = this.normId(gameId);
    return this.cartSubject.value.some(x => this.normId(x.gameId) === id);
  }
}
