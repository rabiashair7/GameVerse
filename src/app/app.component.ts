import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './userService.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  
  constructor(private router: Router,
    public userService: UserService
  ) {
   
  }
  get isDarkMode(): boolean{
    return this.userService.isDarkMode();
  }
}


