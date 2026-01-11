import { Component, OnInit,Input,Output } from '@angular/core';
import { GameService } from '../gameService.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
   @Input() category: string = 'all';
  games: any[] = [];
  filteredGames: any[] = [];
  search = '';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      this.filteredGames = [...games];
    });
  }

  searchGames(): void {
    const q = this.search.toLowerCase().trim();

    if (!q) {
      this.filteredGames = [...this.games];
      return;
    }

    this.filteredGames = this.games.filter(g =>
      g.title?.toLowerCase().includes(q) ||
      g.developer?.toLowerCase().includes(q)
    );
  }
}
