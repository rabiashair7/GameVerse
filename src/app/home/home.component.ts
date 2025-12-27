import { Component, OnInit } from '@angular/core';
import { GameService } from '../gameService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  games: any[] = [];
  popularGames: any[] = [];

  search = '';
  sortBy: 'title' | 'price' | 'date' = 'title';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.games$.subscribe(games => {
      this.games = games;
      this.popularGames = this.gameService.getPopularGames(6);
      this.applySearchAndSort();
    });
  }

  applySearchAndSort(): void {
    let filtered = [...this.gameService.getGames()];

    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(q)
      );
    }

    if (this.sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'date') {
      filtered.sort((a, b) =>
        (a.releaseDate || '').localeCompare(b.releaseDate || '')
      );
    } else {
      filtered.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    this.games = filtered;
  }
}
