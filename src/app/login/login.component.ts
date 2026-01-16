import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';
import { User } from '../modules/users'; // if you use a User class

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    this.error = '';

    const user = this.userService.login(this.email, this.password);

    if (!user) {
      this.error = 'Invalid email or password';
      return;
    }

    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/profile']);
    }
  }
}
