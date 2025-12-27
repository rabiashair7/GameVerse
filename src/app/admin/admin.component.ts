import { Component, OnInit } from '@angular/core';
import { GameService } from '../gameService.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  games: any[] = [];

  categories: string[] = [
    'action',
    'adventure',
    'rpg',
    'sports',
    'racing',
    'strategy',
    'open-world'
  ];

  title = '';
  price: number | null = null;
  image = '';
  unitsSold: number | null = null;
  releaseDate = '';
  details = '';

  imagesText = '';
  videosText = '';

  selectedCategories: string[] = [];
  editingGame: any = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.games$.subscribe(games => {
      this.games = games;
    });
  }

  toggleCategory(cat: string): void {
    if (this.selectedCategories.includes(cat)) {
      this.selectedCategories =
        this.selectedCategories.filter(c => c !== cat);
    } else {
      this.selectedCategories.push(cat);
    }
  }

  addGame(): void {
    if (!this.title || this.price === null) return;

    const newGame = {
      id: Date.now(),
      title: this.title,
      price: this.price,
      coverImage: this.image,
      unitsSold: this.unitsSold ?? 0,
      releaseDate: this.releaseDate,
      details: this.details,
      images: this.imagesText.split('\n').filter(x => x.trim()),
      videos: this.videosText.split('\n').filter(x => x.trim()),
      categories: [...this.selectedCategories]
    };

    this.gameService.addGame(newGame);
    this.resetForm();
  }

  editGame(game: any): void {
    this.editingGame = game;

    this.title = game.title;
    this.price = game.price;
    this.image = game.coverImage;
    this.unitsSold = game.unitsSold || 0;
    this.releaseDate = game.releaseDate || '';
    this.details = game.details || '';
    this.imagesText = (game.images || []).join('\n');
    this.videosText = (game.videos || []).join('\n');
    this.selectedCategories = [...game.categories];
  }

  saveEdit(): void {
    if (!this.editingGame) return;

    const updated = {
      ...this.editingGame,
      title: this.title,
      price: this.price,
      coverImage: this.image,
      unitsSold: this.unitsSold ?? 0,
      releaseDate: this.releaseDate,
      details: this.details,
      images: this.imagesText.split('\n').filter(x => x.trim()),
      videos: this.videosText.split('\n').filter(x => x.trim()),
      categories: [...this.selectedCategories]
    };

    this.gameService.updateGame(updated);
    this.editingGame = null;
    this.resetForm();
  }

  deleteGame(id: number): void {
    this.gameService.deleteGame(id);
  }

  resetForm(): void {
    this.title = '';
    this.price = null;
    this.image = '';
    this.unitsSold = null;
    this.releaseDate = '';
    this.details = '';
    this.imagesText = '';
    this.videosText = '';
    this.selectedCategories = [];
  }
}
