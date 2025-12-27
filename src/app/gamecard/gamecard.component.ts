import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.css']
})
export class GamecardComponent {
 @Input() game: any;
}
