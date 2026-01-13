import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  role: 'admin' | 'user';
  banned: boolean;
  createdAt: string;
}
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
      return this.darkMode;   }

  private users: User[] = [];
  private currentUser: User | null = null;

  private dataUrl = 'assets/users.json';

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  /* =============================
     LOAD USERS (READ-ONLY)
     ============================= */
  private loadUsers(): void {
    this.http.get<{ users: User[] }>(this.dataUrl)
      .subscribe(data => {
        this.users = data.users || [];
      });
  }

  /* =============================
     LOGIN (EMAIL BASED)
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

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getCurrentUser(): Omit<User, 'password'> | null {
    if (!this.currentUser) return null;
    const { password, ...safe } = this.currentUser;
    return safe;
  }

  /* =============================
     REGISTER (IN MEMORY ONLY)
     ============================= */
  register(data: {
    fullName: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
  }): boolean {

    const emailExists = this.users.some(
      u => u.email === data.email
    );

    if (emailExists) return false;

    const newUser: User = {
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
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    return true;
  }

  /* =============================
     ADMIN HELPERS (IN MEMORY)
     ============================= */
  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...safe }) => safe);
  }

  toggleRole(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    const adminsCount = this.users.filter(
      u => u.role === 'admin' && !u.banned
    ).length;

    if (user.role === 'admin' && adminsCount === 1) return;

    user.role = user.role === 'admin' ? 'user' : 'admin';
  }

  banUser(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    const adminsCount = this.users.filter(
      u => u.role === 'admin' && !u.banned
    ).length;

    if (user.role === 'admin' && adminsCount === 1) return;

    user.banned = true;
  }

  unbanUser(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (user) user.banned = false;
  }
}
