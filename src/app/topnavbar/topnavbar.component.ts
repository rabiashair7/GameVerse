import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopNavbarComponent {

  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  toggleTheme(): void {
    this.userService.toggleTheme();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
