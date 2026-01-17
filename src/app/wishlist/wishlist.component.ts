import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from '../gameService.service';
import { UserService } from '../userService.service';

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
          idSet.has(g.id)
        );

        // preserve wishlist order
        this.wishlistGames.sort(
          (a, b) =>
            this.wishlistIds.indexOf(a.id) -
            this.wishlistIds.indexOf(b.id)
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

    // optimistic UI
    this.wishlistIds = this.wishlistIds.filter(id => id !== gameId);
    this.wishlistGames = this.wishlistGames.filter(g => g.id !== gameId);

    // persist
    this.userService.removeFromWishlist(gameId);
  }

  trackByGameId(_: number, g: any): string {
    return g.id;
  }
}
