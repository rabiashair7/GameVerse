import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // =============================
  // THEME STATE (UI ONLY)
  // =============================
  private darkMode = false;

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  // =============================
  // AUTH STATE (IN MEMORY)
  // =============================
  private currentUser: any = null;

  // =============================
  // DATA SOURCE
  // =============================
  private dataUrl = 'assets/data/gameverse-data.json';

  constructor(private http: HttpClient) {}

  // =============================
  // HTTP USERS
  // =============================
  getUsers(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.users || [])
    );
  }

  // =============================
  // LOGIN
  // =============================
  login(username: string, password: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
        const user = users.find(
          u => u.username === username && u.password === password
        );

        if (user) {
          this.currentUser = user;
          return true;
        }

        return false;
      })
    );
  }

  // =============================
  // LOGOUT
  // =============================
  logout(): void {
    this.currentUser = null;
  }

  // =============================
  // AUTH HELPERS
  // =============================
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  // =============================
  // REGISTER (IN-MEMORY ONLY)
  // =============================
  register(newUser: any): void {
    // JSON is read-only → simulate backend
    this.currentUser = {
      ...newUser,
      role: 'user'
    };
  }
}
