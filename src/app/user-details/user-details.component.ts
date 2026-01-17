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

    this.user = new User(u);
  }

  /* =============================
     PROFILE IMAGE
     ============================= */
  get avatarSrc(): string {
    // 1️⃣ Custom uploaded image (permanent)
    if (this.user.profileImage) {
      return this.user.profileImage;
    }

    // 2️⃣ Fallback to gender avatar
    return this.user.gender === 'male'
      ? 'assets/avatar male.webp'
      : 'assets/avatar female.webp';
  }

  onImageUpload(event: Event): void {
    this.clearMessages();

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      const ok = this.userService.updateProfileImage(base64);

      if (!ok) {
        this.error = 'Failed to update profile image';
        return;
      }

      this.user.profileImage = base64;
      this.success = 'Profile image updated successfully';
    };

    reader.readAsDataURL(file);
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
      this.user = new User(u);
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
