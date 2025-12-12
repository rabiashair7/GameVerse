import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../userService.service';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent {

  constructor(
    public userService: UserServiceService,
    private router: Router
  ) {}

  navigate(path: string) {
    if (!this.userService.isLoggedIn() && (path === '/library' || path === '/profile')) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([path]);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
