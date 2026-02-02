import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../gameService.service';
import { UserService } from '../userService.service';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {

  loading = true;
  error = '';

  libraryIds: string[] = [];
  libraryGames: any[] = [];

  private sub?: Subscription;

  constructor(
    private gameService: GameService,
    public userService: UserService,
    private libraryService: LibraryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadLibrary();

    this.sub = this.libraryService.library$.subscribe(() => {
      this.loadLibrary();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadLibrary(): void {
    this.loading = true;
    this.error = '';

    this.libraryIds = this.libraryService.getLibraryIds();

    this.gameService.getGames().subscribe({
      next: (games: any[]) => {
        this.libraryGames = games.filter(g =>
          this.libraryIds.includes(String(g.id))
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load library games.';
        this.loading = false;
      }
    });
  }

  remove(gameId: string): void {
    this.libraryService.removeFromLibrary(gameId);
  }

  goToDetails(gameId: string): void {
    this.router.navigate(['/game', gameId]);
  }
}
