import { Component, OnInit } from '@angular/core';
import { UserService } from '../userService.service';
import { User } from '../modules/users';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user!: User;

  // modes
  editMode = false;
  passwordMode = false;

  // password fields
  currentPassword = '';
  newPassword = '';

  // messages
  error = '';
  success = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const u = this.userService.getCurrentUser();
    if (!u) return;

    this.user = new User(u); // ✅ FIX
  }

  /* =============================
     AVATAR (GENDER BASED)
     ============================= */
  get avatarSrc(): string {
    return this.user.gender === 'male'
      ? 'assets/avatars/avatar-male.png'
      : 'assets/avatars/avatar-female.png';
  }

  /* =============================
     PROFILE UPDATE
     ============================= */
  saveProfile(): void {
    this.clearMessages();

    const ok = this.userService.updateProfile({
      fullName: this.user.fullName,
      gender: this.user.gender,
      dob: this.user.dob
    });

    if (!ok) {
      this.error = 'Failed to update profile';
      return;
    }

    this.success = 'Profile updated successfully';
    this.editMode = false;
  }

  cancelEdit(): void {
    const u = this.userService.getCurrentUser();
    if (u) {
      this.user = new User(u); // ✅ FIX
    }
    this.editMode = false;
    this.clearMessages();
  }

  /* =============================
     PASSWORD CHANGE
     ============================= */
  changePassword(): void {
    this.clearMessages();

    if (!this.currentPassword || !this.newPassword) {
      this.error = 'All password fields are required';
      return;
    }

    const ok = this.userService.changePassword(
      this.currentPassword,
      this.newPassword
    );

    if (!ok) {
      this.error = 'Current password is incorrect';
      return;
    }

    this.success = 'Password updated successfully';
    this.passwordMode = false;

    this.currentPassword = '';
    this.newPassword = '';
  }

  cancelPassword(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.passwordMode = false;
    this.clearMessages();
  }

  /* =============================
     HELPERS
     ============================= */
  private clearMessages(): void {
    this.error = '';
    this.success = '';
  }
}
