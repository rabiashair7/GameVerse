import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from '../gameService.service';
import { UserService } from '../userService.service';
import { Game } from '../modules/games'; // adjust path if needed

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  loading = true;
  error = '';

  wishlistIds: number[] = [];
  wishlistGames: Game[] = [];

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

    this.wishlistIds = Array.isArray(user.wishlist) ? [...user.wishlist] : [];

    // ✅ use existing GameService API
    this.gameService.getGames().subscribe({
      next: (games: Game[]) => {
        const idSet = new Set(this.wishlistIds);

        this.wishlistGames = (games || []).filter(g => idSet.has(g.id));

        // keep wishlist order stable
        this.wishlistGames.sort(
          (a, b) => this.wishlistIds.indexOf(a.id) - this.wishlistIds.indexOf(b.id)
        );

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load wishlist games.';
        this.loading = false;
      }
    });
  }

  viewGame(game: Game): void {
    this.router.navigate(['/game', game.id]);
  }

  remove(gameId: number, ev?: Event): void {
    ev?.stopPropagation();

    // optimistic UI
    this.wishlistIds = this.wishlistIds.filter(id => id !== gameId);
    this.wishlistGames = this.wishlistGames.filter(g => g.id !== gameId);

    // persistence remains ONLY in UserService
    this.userService.removeFromWishlist(gameId);
  }

  trackByGameId(_: number, g: Game): number {
    return g.id;
  }
}
