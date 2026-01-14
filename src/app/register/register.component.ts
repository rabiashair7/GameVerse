import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
   ngOnInit(): void {
    this.loadUser();
  }
   loadUser(): void {
    this.users = this.userService.getAllUsers();
    this.filteredUsers = [...this.users];
  }

   filterUsers(): void {
    const value = this.userSearch.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.fullName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  }
  users: any[] = [];
  filteredUsers: any[] = [];
  userSearch = '';
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    dob: ['', [Validators.required, this.noFutureDate]],
    gender: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.strongPassword
    ]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsMatch });

  /* =============================
     VALIDATORS
     ============================= */
  noFutureDate(control: AbstractControl) {
    if (!control.value) return null;
    return new Date(control.value) > new Date()
      ? { futureDate: true }
      : null;
  }

  strongPassword(control: AbstractControl) {
    const v = control.value || '';
    const ok =
      /[A-Z]/.test(v) &&
      /[a-z]/.test(v) &&
      /[0-9]/.test(v) &&
      /[^A-Za-z0-9]/.test(v);
    return ok ? null : { weakPassword: true };
  }

  passwordsMatch(group: AbstractControl) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { passwordMismatch: true };
  }

  /* =============================
     ACTION
     ============================= */
  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const success = this.userService.register({
      fullName: this.registerForm.value.fullName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      gender: this.registerForm.value.gender as 'male' | 'female'
    });

    if (!success) {
      alert('Email already exists');
      return;
    }

    this.router.navigate(['/login']);
  }

  /* =============================
     HELPERS
     ============================= */
  isInvalid(name: string): boolean {
    const c = this.registerForm.get(name);
    return !!(c && c.invalid && c.touched);
  }
}
