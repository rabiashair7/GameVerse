import { Component } from '@angular/core';
import { GameServiceService, Game } from '../gameService.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private gameService: GameServiceService) {}

  addGame() {
    const newGame: Game = {
      id: 0, // ייקבע ע"י השירות
      title: 'Cyberpunk 2077',
      category: 'rpg',
      price: 60,
      image: 'assets/cyberpunk.jpg'
    };

    this.gameService.addGame(newGame);
  }
}
