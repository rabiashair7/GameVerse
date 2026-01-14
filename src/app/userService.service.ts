import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './modules/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /* =============================
     THEME
     ============================= */
  private darkMode = false;

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  /* =============================
     USERS STATE
     ============================= */
  private users: User[] = [];
  private currentUser: User | null = null;

  private dataUrl = 'http://localhost:3001/users';

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  /* =============================
     LOAD USERS
     ============================= */
  private loadUsers(): void {
    this.http.get<User[]>(this.dataUrl).subscribe(users => {
      this.users = users.map(u => new User(u));
    });
  }

  /* =============================
     AUTH
     ============================= */
  login(email: string, password: string): boolean {
    const user = this.users.find(
      u => u.email === email && u.password === password
    );

    if (!user || user.banned) return false;

    this.currentUser = user;
    return true;
  }

  logout(): void {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /* =============================
     REGISTER (PERMANENT)
     ============================= */
  register(data: {
    fullName: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
  }): boolean {

    const emailExists = this.users.some(u => u.email === data.email);
    if (emailExists) return false;

    const newUser = new User({
      id: this.users.length
        ? Math.max(...this.users.map(u => u.id)) + 1
        : 1,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      role: 'user',
      banned: false,
      createdAt: new Date().toISOString()
    });

    this.http.post<User>(this.dataUrl, newUser).subscribe(savedUser => {
      const user = new User(savedUser);
      this.users.push(user);
      this.currentUser = user;
    });

    return true;
  }

  /* =============================
     ADMIN HELPERS
     ============================= */
  getAllUsers(): User[] {
    return this.users;
  }

  toggleRole(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    const activeAdmins = this.users.filter(
      u => u.role === 'admin' && !u.banned
    ).length;

    if (user.role === 'admin' && activeAdmins === 1) return;

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    user.role = newRole;

    this.http
      .patch(`${this.dataUrl}/${user.id}`, { role: newRole })
      .subscribe();
  }

  banUser(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    const activeAdmins = this.users.filter(
      u => u.role === 'admin' && !u.banned
    ).length;

    if (user.role === 'admin' && activeAdmins === 1) return;

    user.banned = true;

    this.http
      .patch(`${this.dataUrl}/${user.id}`, { banned: true })
      .subscribe();
  }

  unbanUser(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    user.banned = false;

    this.http
      .patch(`${this.dataUrl}/${user.id}`, { banned: false })
      .subscribe();
  }
}
