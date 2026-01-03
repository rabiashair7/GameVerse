import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/* =============================
   USER MODEL (STRICT SAFE)
   ============================= */
interface User {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'user';
  banned?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /* =============================
     THEME STATE (UI ONLY)
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
     AUTH STATE (IN MEMORY)
     ============================= */
  private currentUser: User | null = null;

  /* =============================
     USERS STATE (IN MEMORY)
     ============================= */
  private users: User[] = [];

  /* =============================
     DATA SOURCE
     ============================= */
  private dataUrl = 'assets/data/gameverse-data.json';

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  /* =============================
     LOAD USERS (ONCE)
     ============================= */
  private loadUsers(): void {
    this.http.get<any>(this.dataUrl)
      .pipe(map(data => data.users || []))
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  /* =============================
     SAFE USERS FOR ADMIN UI
     ============================= */
  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...safeUser }) => safeUser);
  }

  /* =============================
     LOGIN
     ============================= */
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.users || []),
      map((users: User[]) => {

        const user = users.find(
          (u: User) =>
            u.username === username &&
            u.password === password
        );

        if (!user || user.banned) {
          return false;
        }

        this.currentUser = user;
        return true;
      })
    );
  }

  /* =============================
     LOGOUT
     ============================= */
  logout(): void {
    this.currentUser = null;
  }

  /* =============================
     AUTH HELPERS
     ============================= */
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getCurrentUser(): Omit<User, 'password'> | null {
    if (!this.currentUser) return null;

    const { password, ...safeUser } = this.currentUser;
    return safeUser;
  }

  /* =============================
     REGISTER (IN-MEMORY ONLY)
     ============================= */
  register(newUser: Partial<User>): void {
    const user: User = {
      username: newUser.username!,
      password: newUser.password!,
      email: newUser.email!,
      fullName: newUser.fullName,
      role: 'user',
      banned: false
    };

    this.users.push(user);
    this.currentUser = user;
  }

  /* =============================
     ADMIN ACTIONS (IN-MEMORY)
     ============================= */
  toggleRole(email: string): void {
  const user = this.users.find(u => u.email === email);
  if (!user) return;

  // prevent self-demotion
  if (this.currentUser?.email === email) return;

  // 🔒 protect last admin from demotion
  const adminsCount = this.users.filter(
    u => u.role === 'admin' && !u.banned
  ).length;

  if (user.role === 'admin' && adminsCount === 1) {
    console.warn('Cannot demote the last admin');
    return;
  }

  user.role = user.role === 'admin' ? 'user' : 'admin';
}


  banUser(email: string): void {
  const user = this.users.find(u => u.email === email);
  if (!user) return;

  // 🔒 Protect last admin
  const adminsCount = this.users.filter(
    u => u.role === 'admin' && !u.banned
  ).length;

  if (user.role === 'admin' && adminsCount === 1) {
    console.warn('Cannot ban the last admin');
    return;
  }

  user.banned = true;
}

  unbanUser(email: string): void {
    const user = this.users.find((u: User) => u.email === email);
    if (user) user.banned = false;
  }
}
