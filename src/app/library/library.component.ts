import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../gameService.service';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  loading = true;
  error = '';

  libraryIds: string[] = [];
  libraryGames: any[] = [];

  constructor(
    private gameService: GameService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
   
    this.waitForUserThenLoad();
  }

  private waitForUserThenLoad(): void {
    let tries = 0;
    const maxTries = 20;

    const tick = () => {
      const user = this.userService.getCurrentUser();
      if (user) {
        this.loadLibrary();
        return;
      }

      tries++;
      if (tries >= maxTries) {
        this.router.navigate(['/login']);
        return;
      }

      setTimeout(tick, 100);
    };

    tick();
  }

  private loadLibrary(): void {
    this.loading = true;
    this.error = '';

    this.libraryIds = this.userService.getLibraryIds();

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
    this.userService.removeFromLibrary(gameId);

    
    this.libraryIds = this.libraryIds.filter(id => id !== gameId);
    this.libraryGames = this.libraryGames.filter(g => String(g.id) !== gameId);
  }

  goToDetails(gameId: string): void {
    this.router.navigate(['/game', gameId]);
  }
}
