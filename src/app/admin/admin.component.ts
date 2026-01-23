import { Component, OnInit } from '@angular/core';
import { GameService } from '../gameService.service';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  view: 'add' | 'edit' | 'delete' | 'users' = 'add';

 
  games: any[] = [];
  filteredGames: any[] = [];
  gameSearch = '';

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
  developer = '';
  price: number | null = null;
  image = '';
  unitsSold = '';
  releaseDate = '';
  details = '';

  imagesText = '';
  videosText = '';

  selectedCategories: string[] = [];
  editingGame: any = null;

  
  users: any[] = [];
  filteredUsers: any[] = [];
  userSearch = '';

  constructor(
    private gameService: GameService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadUsers();
  }

  
  loadGames(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      this.filteredGames = [...games];
    });
  }

  setView(v: 'add' | 'edit' | 'delete' | 'users'): void {
    this.view = v;
    this.editingGame = null;

    if (v === 'users') this.loadUsers();
    if (v === 'edit' || v === 'delete') {
      this.filteredGames = [...this.games];
    }
  }


  loadUsers(): void {
    this.users = this.userService.getAllUsers();
    this.filteredUsers = [...this.users];
  }

  filterUsers(): void {
    const value = this.userSearch.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.fullName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  }

  toggleRole(email: string): void {
    this.userService.toggleRole(email);
    this.loadUsers();
  }

  banUser(email: string): void {
    this.userService.banUser(email);
    this.loadUsers();
  }

  unbanUser(email: string): void {
    this.userService.unbanUser(email);
    this.loadUsers();
  }
  filterGames(): void {
    const value = this.gameSearch.toLowerCase().trim();
    this.filteredGames = this.games.filter(game =>
      game.title?.toLowerCase().includes(value) ||
      game.developer?.toLowerCase().includes(value) ||
      game.categories?.some((c: string) =>
        c.toLowerCase().includes(value)
      )
    );
  }

  toggleCategory(cat: string): void {
    this.selectedCategories.includes(cat)
      ? this.selectedCategories =
          this.selectedCategories.filter(c => c !== cat)
      : this.selectedCategories.push(cat);
  }

  addGame(): void {
    if (!this.title || !this.developer || this.price === null) return;

    const newGame = {
      title: this.title,
      developer: this.developer,
      price: this.price,
      image: this.image,
      unitsSold: this.unitsSold,
      releaseDate: this.releaseDate,
      details: this.details,
      images: this.imagesText.split('\n').filter(x => x.trim()),
      videos: this.videosText.split('\n').filter(x => x.trim()),
      categories: [...this.selectedCategories]
    };

    this.gameService.addGame(newGame).subscribe(() => {
      this.loadGames();
      this.resetForm();
    });
  }

 
  editGame(game: any): void {
    this.editingGame = game;

    this.title = game.title;
    this.developer = game.developer;
    this.price = game.price;
    this.image = game.image;
    this.unitsSold = game.unitsSold || '';
    this.releaseDate = game.releaseDate || '';
    this.details = game.details || '';
    this.imagesText = (game.images || []).join('\n');
    this.videosText = (game.videos || []).join('\n');
    this.selectedCategories = [...game.categories];

    this.view = 'edit';
  }

  saveEdit(): void {
    if (!this.editingGame) return;

    const updated = {
      ...this.editingGame,
      title: this.title,
      developer: this.developer,
      price: this.price,
      image: this.image,
      unitsSold: this.unitsSold,
      releaseDate: this.releaseDate,
      details: this.details,
      images: this.imagesText.split('\n').filter(x => x.trim()),
      videos: this.videosText.split('\n').filter(x => x.trim()),
      categories: [...this.selectedCategories]
    };

    this.gameService.updateGame(updated).subscribe(() => {
      this.loadGames();
      this.editingGame = null;
      this.resetForm();
    });
  }

  deleteGame(id: string): void {
    this.gameService.deleteGame(id).subscribe(() => {
      this.loadGames();
    });
  }

 
  resetForm(): void {
    this.title = '';
    this.developer = '';
    this.price = null;
    this.image = '';
    this.unitsSold = '';
    this.releaseDate = '';
    this.details = '';
    this.imagesText = '';
    this.videosText = '';
    this.selectedCategories = [];
  }
}
