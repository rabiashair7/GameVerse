import { Injectable } from '@angular/core';

export interface Game {
  id: number;
  title: string;
  category: string;
  price: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {

  private readonly STORAGE_KEY = 'gameverse_games';
  private games: Game[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // טעינת משחקים מ־localStorage
  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.games = data ? JSON.parse(data) : [];
  }

  // שמירה ל־localStorage
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.games));
  }

  // =========================
  // ====== READ (User) ======
  // =========================

  // כל המשחקים
  getAllGames(): Game[] {
    return [...this.games];
  }

  // משחקים לפי קטגוריה
  getGamesByCategory(category: string): Game[] {
    return this.games.filter(
      g => g.category === category.toLowerCase()
    );
  }

  // חיפוש משחקים
  searchGames(term: string): Game[] {
    return this.games.filter(g =>
      g.title.toLowerCase().includes(term.toLowerCase())
    );
  }

  // משחק לפי ID
  getGameById(id: number): Game | undefined {
    return this.games.find(g => g.id === id);
  }

  // =========================
  // ===== ADMIN ONLY ========
  // =========================

  // הוספת משחק (Admin)
  addGame(game: Game): void {
    game.id = Date.now(); // ID פשוט וייחודי
    this.games.push(game);
    this.saveToStorage();
  }

  // מחיקת משחק (Admin)
  removeGame(id: number): void {
    this.games = this.games.filter(g => g.id !== id);
    this.saveToStorage();
  }

  // עריכת משחק (Admin)
  updateGame(updated: Game): void {
    const index = this.games.findIndex(g => g.id === updated.id);
    if (index !== -1) {
      this.games[index] = updated;
      this.saveToStorage();
    }
  }
}
