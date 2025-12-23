import { Component } from '@angular/core';
import { UserService } from '../userService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopNavbarComponent {

  constructor(
    public userService: UserService,
    private router: Router     // ✅ FIX
  ) {}

  toggleTheme(): void {
    this.userService.toggleTheme();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);  // ✅ now works
  }
}
