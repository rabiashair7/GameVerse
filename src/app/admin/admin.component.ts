import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentUser: any;
  games: any[] = [];
  newGame = { title: '', price: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    this.games = JSON.parse(localStorage.getItem('games') || '[]');
  }

  addGame() {
    this.games.push({ ...this.newGame });
    localStorage.setItem('games', JSON.stringify(this.games));
    this.newGame = { title: '', price: 0 };
  }

  deleteGame(index: number) {
    this.games.splice(index, 1);
    localStorage.setItem('games', JSON.stringify(this.games));
  }
}
