import { Component } from '@angular/core';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-topnavbar',
  standalone: false,
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']

})
export class TopNavbarComponent {

  constructor(public userService: UserService) {}

  toggleTheme(): void {
    this.userService.toggleTheme();
  }
}
