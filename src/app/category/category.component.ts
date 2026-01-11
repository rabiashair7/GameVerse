import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../gameService.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
   @Input() menuMode: boolean = false;   // 👈 בשביל Catalog
  @Output() categorySelected = new EventEmitter<string>(); // 👈 בשביל Catalog
  category = '';
  games: any[] = [];
  filteredGames: any[] = [];

  search = '';
  sortBy: 'title' | 'price' = 'title';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['name'];

      this.gameService.getGames().subscribe(games => {
        this.games = games.filter(g =>
          g.categories?.includes(this.category)
        );
        this.applyFilters();
      });
    });
  }

  applyFilters(): void {
    let result = [...this.games];

    // SEARCH
    const q = this.search.toLowerCase().trim();
    if (q) {
      result = result.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.developer?.toLowerCase().includes(q)
      );
    }

    // SORT
    if (this.sortBy === 'price') {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    this.filteredGames = result;
  }
}
