import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../userService.service';
import { User } from '../modules/users';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopNavbarComponent {

  dropdownOpen = false;

  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  /* =============================
     PROFILE IMAGE
     ============================= */
  get avatarSrc(): string | null {
    const user: User | null = this.userService.getCurrentUser();
    if (!user) return null;

    // 1️⃣ Custom uploaded image
    if (user.profileImage) {
      return user.profileImage;
    }

    // 2️⃣ Gender fallback
    return user.gender === 'male'
      ? 'assets/avatar male.webp'
      : 'assets/avatar female.webp';
  }

  /* =============================
     DROPDOWN
     ============================= */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  goToProfile(): void {
    this.closeDropdown();
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.closeDropdown();
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.userService.toggleTheme();
  }
}
