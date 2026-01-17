import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from '../gameService.service';
import { UserService } from '../userService.service';
import { CartService } from '../cart.service'; 

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  loading = true;
  error = '';

  // ✅ IDs are STRINGS (db.json source of truth)
  wishlistIds: string[] = [];

  // ✅ NO Game model / interface
  wishlistGames: any[] = [];

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private cartService: CartService, // ✅ NEW
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // ✅ enforce string[]
    this.wishlistIds = Array.isArray(user.wishlist)
      ? [...user.wishlist]
      : [];

    this.gameService.getGames().subscribe({
      next: (games: any[]) => {
        const idSet = new Set(this.wishlistIds);

        // map IDs → full game objects
        this.wishlistGames = (games || []).filter(g =>
          idSet.has(String(g.id)) // ✅ make sure it's string
        );

        // preserve wishlist order
        this.wishlistGames.sort(
          (a, b) =>
            this.wishlistIds.indexOf(String(a.id)) -
            this.wishlistIds.indexOf(String(b.id))
        );

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load wishlist games.';
        this.loading = false;
      }
    });
  }

  viewGame(game: any): void {
    this.router.navigate(['/game', game.id]);
  }

  remove(gameId: string, ev?: Event): void {
    ev?.stopPropagation();

    const id = String(gameId);

    // optimistic UI
    this.wishlistIds = this.wishlistIds.filter(x => x !== id);
    this.wishlistGames = this.wishlistGames.filter(g => String(g.id) !== id);

    // persist
    this.userService.removeFromWishlist(id);
  }

  trackByGameId(_: number, g: any): string {
    return String(g.id);
  }

  /* =============================
     🛒 CART (NEW LOGIC)
     ============================= */

  addToCart(game: any, ev?: Event): void {
    ev?.stopPropagation();

    // optional: force login
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart({
      gameId: String(game.id),
      title: game.title,
      price: Number(game.price) || 0,
      image: game.image
    }, 1);
  }

  isInCart(gameId: string): boolean {
    return this.cartService.isInCart(String(gameId));
  }
}
