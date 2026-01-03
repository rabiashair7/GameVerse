import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // ---------- LOGIN ----------
  username = '';
  password = '';
  error = '';

  // ---------- FORGOT PASSWORD ----------
  forgotStep: 'login' | 'email' | 'code' | 'newPassword' = 'login';
  resetCode = '';
  generatedCode = '';
  resetEmail = '';

  newPasswordForm = this.fb.group({
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
    ]]
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  // ================= LOGIN =================
  login(): void {
    this.error = '';
    this.userService.login(this.username, this.password)
      .subscribe(success => {
        if (!success) {
          this.error = 'Invalid username or password';
          return;
        }
        this.router.navigate(['/home']);
      });
  }

  // ================= FORGOT PASSWORD FLOW =================

  openForgotPassword() {
    this.forgotStep = 'email';
  }

  sendResetCode() {
    if (!this.resetEmail) return;

    this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Password reset code sent to email:', this.generatedCode);

    this.forgotStep = 'code';
  }

  verifyResetCode() {
    if (this.resetCode !== this.generatedCode) {
      alert('Invalid reset code');
      return;
    }
    this.forgotStep = 'newPassword';
  }

  saveNewPassword() {
    if (this.newPasswordForm.invalid) return;

    // JSON is read-only → simulate backend success
    console.log('New password set:', this.newPasswordForm.value.password);

    alert('Password successfully reset');
    this.resetState();
  }

  resetState() {
    this.forgotStep = 'login';
    this.resetCode = '';
    this.resetEmail = '';
    this.generatedCode = '';
    this.newPasswordForm.reset();
  }
}
