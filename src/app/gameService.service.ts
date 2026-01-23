import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:3000/games';

  constructor(private http: HttpClient) {}

 

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(games =>
        games.map(g => ({
          ...g,
          popular: g.popular ?? this.isPopular(g.unitsSold),
          rating: g.rating ?? null
        }))
      )
    );
  }

  getGameById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(game => ({
        ...game,
        popular: game.popular ?? this.isPopular(game.unitsSold),
        rating: game.rating ?? null
      }))
    );
  }

  getPopularGames(limit: number = 6): Observable<any[]> {
    return this.getGames().pipe(
      map(games =>
        games.filter(g => g.popular).slice(0, limit)
      )
    );
  }



  addGame(game: any): Observable<any> {
    const payload = {
      ...game,
      rating: game.rating ?? null,
      popular: this.isPopular(game.unitsSold)
    };

    return this.http.post<any>(this.apiUrl, payload);
  }


  updateGame(game: any): Observable<any> {
    const payload = {
      ...game,
      rating: game.rating ?? null,
      popular: this.isPopular(game.unitsSold)
    };

    return this.http.put<any>(`${this.apiUrl}/${game.id}`, payload);
  }



  deleteGame(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchGames(query: string): Observable<any[]> {
    const q = query.trim();
    if (!q) return this.getGames();

    return this.http.get<any[]>(
      `${this.apiUrl}?q=${encodeURIComponent(q)}`
    );
  }

  private isPopular(unitsSold?: string): boolean {
    return this.parseUnitsSold(unitsSold) >= 10_000_000;
  }

  private parseUnitsSold(value?: string): number {
    if (!value) return 0;

    const v = value.trim().toUpperCase();
    const n = parseFloat(v);

    if (v.endsWith('B')) return n * 1_000_000_000;
    if (v.endsWith('M')) return n * 1_000_000;
    if (v.endsWith('K')) return n * 1_000;

    return isNaN(n) ? 0 : n;
  }
}
