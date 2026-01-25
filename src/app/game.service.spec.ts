import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {

  private apiUrl = 'http://localhost:3001/games';

  constructor(private http: HttpClient) {}

  getGames() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getGameById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
