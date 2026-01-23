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
  filteredGames: any[] = [];

  
  search = '';
  sortBy: 'title' | 'price' | 'date' = 'title';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      this.filteredGames = [...games];
      this.popularGames = games.filter(g => g.popular);
      this.applySearchAndSort();
    });
  }

 
  applySearchAndSort(): void {
    let result = [...this.games];

    const q = this.search.toLowerCase().trim();
    if (q) {
      result = result.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.developer?.toLowerCase().includes(q)
      );
    }

    switch (this.sortBy) {
      case 'price':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'date':
        result.sort((a, b) =>
          new Date(b.releaseDate).getTime() -
          new Date(a.releaseDate).getTime()
        );
        break;
      default:
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
    }

    this.filteredGames = result;
  }
}
