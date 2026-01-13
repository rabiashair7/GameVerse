import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';

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

    const success = this.userService.login(this.email, this.password);

    if (!success) {
      this.error = 'Invalid email or password';
      return;
    }

    this.router.navigate(['/home']);
  }
}
