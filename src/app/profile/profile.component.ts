import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoggedIn = false;
  view: 'login' | 'signup' | 'profile' = 'login';

  login() {
    this.isLoggedIn = true;
    this.view = 'profile';
  }

  logout() {
    this.isLoggedIn = false;
    this.view = 'login';
  }

  switchToSignup() {
    this.view = 'signup';
  }

  switchToLogin() {
    this.view = 'login';
  }
}
