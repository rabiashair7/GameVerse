import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // ===== DATE LIMIT (blocks future dates in UI) =====
  today = new Date().toISOString().split('T')[0];

  // ===== STEPS =====
  step: 'form' | 'confirm' = 'form';

  generatedCode = '';
  emailForVerification = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  // ===== REGISTER FORM =====
  registerForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    dob: ['', [
      Validators.required,
      this.noFutureDate
    ]],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.strongPassword
    ]],

    phone: ['', [
      Validators.pattern(/^\+?[0-9]{9,15}$/)
    ]]
  });

  // ===== CONFIRMATION FORM =====
  confirmationForm = this.fb.group({
    code: ['', Validators.required]
  });

  // ===== VALIDATORS =====

  noFutureDate(control: AbstractControl) {
    if (!control.value) return null;
    return new Date(control.value) > new Date()
      ? { futureDate: true }
      : null;
  }

  strongPassword(control: AbstractControl) {
    const v = control.value || '';
    const valid =
      /[A-Z]/.test(v) &&
      /[a-z]/.test(v) &&
      /[0-9]/.test(v) &&
      /[^A-Za-z0-9]/.test(v);
    return valid ? null : { weakPassword: true };
  }

  // ===== ACTIONS =====

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // simulate email confirmation
    this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.emailForVerification = this.registerForm.value.email!;

    console.log('Confirmation code sent to email:', this.generatedCode);

    this.step = 'confirm';
  }

  confirmCode() {
    if (this.confirmationForm.value.code !== this.generatedCode) {
      this.confirmationForm.setErrors({ invalidCode: true });
      return;
    }

    // JSON is read-only → simulate backend registration
    this.userService.register({
      name: this.registerForm.value.name,
      email: this.registerForm.value.email
    });

    this.router.navigate(['/home']);
  }

  // ===== HELPERS =====

  isInvalid(controlName: string): boolean {
    const c = this.registerForm.get(controlName);
    return !!(c && c.invalid && c.touched);
  }

  passwordStrong(): boolean {
    return !this.registerForm.get('password')?.errors;
  }
}
