import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './userService.service';
import { CartItem } from './modules/cart';

@Injectable({ providedIn: 'root' })
export class CartService implements OnDestroy {
  private apiUsers = 'http://localhost:3001/users';

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private userPoll?: any;
  private lastUserId: string | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.userPoll = setInterval(() => {
      const u: any = this.userService.getCurrentUser() as any;
      const uid = u ? String(u.id) : null;

      if (uid !== this.lastUserId) {
        this.lastUserId = uid;

        if (!uid) {
          this.cartSubject.next([]);
        } else {
          this.loadCart(uid);
        }
      }
    }, 250);
  }

  ngOnDestroy(): void {
    if (this.userPoll) clearInterval(this.userPoll);
  }

  private normId(id: string): string {
    return String(id).trim();
  }

  private getUserId(): string | null {
    const u: any = this.userService.getCurrentUser() as any;
    return u ? String(u.id) : null;
  }

  private ensureCart(items: any): CartItem[] {
    if (!Array.isArray(items)) return [];
    return items.map((x: any) => new CartItem({
      gameId: this.normId(x?.gameId),
      title: String(x?.title ?? ''),
      price: Number(x?.price) || 0,
      image: String(x?.image ?? ''),
      qty: Math.max(1, Number(x?.qty) || 1)
    }));
  }

  private loadCart(userId: string): void {
    this.http.get<any>(`${this.apiUsers}/${userId}`).subscribe({
      next: (user) => {
        const cart = this.ensureCart(user?.cart);
        this.cartSubject.next(cart);
      },
      error: () => this.cartSubject.next([])
    });
  }

  private saveCart(items: CartItem[]): void {
    const userId = this.getUserId();

    const normalized = items.map(i => new CartItem(i));
    this.cartSubject.next(normalized);

    if (!userId) return;

    const payload = normalized.map(i => ({
      gameId: i.gameId,
      title: i.title,
      price: i.price,
      image: i.image,
      qty: i.qty
    }));

    this.http.patch(`${this.apiUsers}/${userId}`, { cart: payload }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

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

    cart[idx] = new CartItem({ ...cart[idx], qty: cart[idx].qty + 1 });
    this.saveCart(cart);
  }

  decreaseQty(gameId: string): void {
    const id = this.normId(gameId);
    const cart = [...this.cartSubject.value];
    const idx = cart.findIndex(x => this.normId(x.gameId) === id);
    if (idx === -1) return;

    const newQty = cart[idx].qty - 1;

    if (newQty <= 0) {
      this.saveCart(cart.filter(x => this.normId(x.gameId) !== id));
      return;
    }

    cart[idx] = new CartItem({ ...cart[idx], qty: newQty });
    this.saveCart(cart);
  }

  removeFromCart(gameId: string): void {
    const id = this.normId(gameId);
    this.saveCart(this.cartSubject.value.filter(x => this.normId(x.gameId) !== id));
  }

  clearCart(): void {
    this.saveCart([]);
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
      cart[idx] = new CartItem({ ...cart[idx], qty: cart[idx].qty + safeQty });
    } else {
      cart.push(new CartItem({
        gameId: id,
        title: item.title,
        price: Number(item.price) || 0,
        image: item.image || '',
        qty: safeQty
      }));
    }

    this.saveCart(cart);
  }

  getItemsCount(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }

  isInCart(gameId: string): boolean {
    const id = this.normId(gameId);
    return this.cartSubject.value.some(x => this.normId(x.gameId) === id);
  }
}
