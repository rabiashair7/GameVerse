import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    const success = this.userService.login(this.username, this.password);
    console.log(success);
    if (!success) {
      this.error = 'Invalid username or password';
      return;
    }

    if (this.userService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/profile']);
    }
  }
}
