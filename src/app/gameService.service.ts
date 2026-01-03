import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:3000/games';

  constructor(private http: HttpClient) {}

  /* =======================
     READ
     ======================= */

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getGameById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPopularGames(limit: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?popular=true&_limit=${limit}`);
  }

  /* =======================
     CREATE (ADMIN)
     ======================= */

  addGame(game: any): Observable<any> {
    game.popular = this.isPopular(game.unitsSold);
    return this.http.post<any>(this.apiUrl, game);
  }

  /* =======================
     UPDATE
     ======================= */

  updateGame(game: any): Observable<any> {
    game.popular = this.isPopular(game.unitsSold);
    return this.http.put<any>(`${this.apiUrl}/${game.id}`, game);
  }

  /* =======================
     DELETE
     ======================= */

  deleteGame(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /* =======================
     SEARCH
     ======================= */

  searchGames(query: string): Observable<any[]> {
    const q = query.trim();
    if (!q) {
      return this.getGames();
    }
    return this.http.get<any[]>(
      `${this.apiUrl}?q=${encodeURIComponent(q)}`
    );
  }

  /* =======================
     BUSINESS LOGIC
     ======================= */

  private isPopular(unitsSold: string): boolean {
    return this.parseUnitsSold(unitsSold) >= 10_000_000;
  }

  private parseUnitsSold(value: string): number {
    if (!value) return 0;

    const v = value.trim().toUpperCase();
    const n = parseFloat(v);

    if (v.endsWith('B')) return n * 1_000_000_000;
    if (v.endsWith('M')) return n * 1_000_000;
    if (v.endsWith('K')) return n * 1_000;

    return isNaN(n) ? 0 : n;
  }
}
