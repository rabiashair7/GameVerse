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

  // ===== ACTION =====

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // REGISTER USER (NO VERIFICATION STEP)
    this.userService.register({
      username: this.registerForm.value.email!, // login identifier
      fullName: this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      role: 'user',
      banned: false
    });

    // Redirect after successful registration
    this.router.navigate(['/login']);
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
