import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './userService.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showStoreNavbar = false;

  constructor(private router: Router,public userService: UserService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showStoreNavbar =
          event.url.startsWith('/home') ||
          event.url.startsWith('/games') ||
          event.url.startsWith('/category');
      }
    });
  }
  
  ngOnInit(): void {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { username: 'Rabia149', password: '1492001Rs', role: 'admin' },
        { username: 'user', password: '1234', role: 'user' }
      ]));
    }
  }
  get isDarkMode(): boolean {
    return this.userService.isDarkMode();
  }
}


