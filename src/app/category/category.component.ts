import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../gameService.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  category = '';
  games: any[] = [];

  search = '';
  sortBy: 'title' | 'price' = 'title';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['name'];

      this.gameService.games$.subscribe(allGames => {
        this.applySearchAndSort(allGames);
      });
    });
  }

  applySearchAndSort(allGames: any[]): void {
    let filtered = allGames.filter(g =>
      g.categories.includes(this.category)
    );

    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(q)
      );
    }

    if (this.sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    this.games = filtered;
  }
}
