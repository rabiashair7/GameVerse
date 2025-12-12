import { Injectable } from '@angular/core';

export interface User {
  username: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private readonly STORAGE_KEY = 'gameverse_user';

  // בדיקה האם יש משתמש מחובר
  isLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  // החזרת המשתמש הנוכחי
  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  // התחברות (נקרא ממסך Login)
  login(username: string, role: 'user' | 'admin' = 'user'): void {
    const user: User = { username, role };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  // התנתקות
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // בדיקה האם המשתמש אדמין
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}
