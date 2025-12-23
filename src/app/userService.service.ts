import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private darkMode = false;

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private USERS_KEY = 'users';
  private CURRENT_USER_KEY = 'currentUser';

  constructor() {
    console.log("******************************")
    this.seedUsers();
  }

  // Seed initial users ONCE
  private seedUsers(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([
        { username: 'admin', password: '12345678', role: 'admin' },
        { username: 'user', password: '12345', role: 'user' }
      ]));
    }
  }

  login(username: string, password: string): boolean {
    console.log("Service");
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    console.log(users);
    const foundUser = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (!foundUser) {
      return false;
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(foundUser));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): any | null {
    return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}
