import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private games: any[] = [];
  private gamesSubject = new BehaviorSubject<any[]>([]);
  games$ = this.gamesSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('games');
    if (saved) {
      this.games = JSON.parse(saved);
      this.gamesSubject.next(this.games);
    }
  }

  addGame(game: any): void {
    this.games.push(game);
    this.update();
  }

  updateGame(updatedGame: any): void {
    const index = this.games.findIndex(g => g.id === updatedGame.id);
    if (index !== -1) {
      this.games[index] = updatedGame;
      this.update();
    }
  }

  deleteGame(id: number): void {
    this.games = this.games.filter(g => g.id !== id);
    this.update();
  }

  getGames(): any[] {
    return [...this.games];
  }

  getCategories(): string[] {
    const set = new Set<string>();
    this.games.forEach(g =>
      g.categories?.forEach((c: string) => set.add(c))
    );
    return Array.from(set);
  }

  /* 🔥 POPULAR GAMES (FIXED) */
  getPopularGames(limit: number = 6): any[] {
    return [...this.games]
      .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
      .slice(0, limit);
  }

  private update(): void {
    localStorage.setItem('games', JSON.stringify(this.games));
    this.gamesSubject.next([...this.games]);
  }
}
