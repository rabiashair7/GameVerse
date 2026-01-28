import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './modules/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private darkMode = false;

  private sessionKey = 'gv_user_id';

  private saveSession(userId: any): void {
    localStorage.setItem(this.sessionKey, String(userId));
  }

  private clearSession(): void {
    localStorage.removeItem(this.sessionKey);
  }

  private restoreSession(): void {
    const savedId = localStorage.getItem(this.sessionKey);
    if (!savedId) return;

    const found = this.users.find(u => String(u.id) === String(savedId));
    if (found && !found.banned) {
      this.currentUser = found;
    }
  }

  constructor(private http: HttpClient) {
    this.loadUsers();

    const saved = localStorage.getItem('gv_theme');
    this.darkMode = saved === 'dark';

    document.documentElement.classList.toggle('dark-theme', this.darkMode);
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;

    document.documentElement.classList.toggle('dark-theme', this.darkMode);
    document.body.classList.toggle('dark-theme', this.darkMode);

    localStorage.setItem('gv_theme', this.darkMode ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private users: User[] = [];
  private currentUser: User | null = null;

  private dataUrl = 'http://localhost:3001/users';

  private loadUsers(): void {
    this.http.get<User[]>(this.dataUrl).subscribe(users => {
      this.users = users.map(u => new User(u));
      this.restoreSession();
    });
  }

  login(email: string, password: string): User | null {
    const user = this.users.find(
      u => u.email === email && u.password === password
    );

    if (!user || user.banned) {
      return null;
    }

    this.currentUser = user;
    this.saveSession(user.id);
    return user;
  }

  logout(): void {
    this.currentUser = null;
    this.clearSession();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  register(data: {
    fullName: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
    dob: string;
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
      dob: data.dob,
      role: 'user',
      banned: false,
      createdAt: new Date().toISOString(),
      wishlist: [],
      profileImage: null,

      library: [],
      cart: []
    });

    this.http.post<User>(this.dataUrl, newUser).subscribe(saved => {
      const user = new User(saved);
      this.users.push(user);
      this.currentUser = user;
      this.saveSession(user.id);
    });

    return true;
  }

  updateProfile(data: {
    fullName: string;
    gender: 'male' | 'female';
    dob: string;
  }): boolean {
    if (!this.currentUser) return false;

    const id = this.currentUser.id;

    this.currentUser.fullName = data.fullName;
    this.currentUser.gender = data.gender;
    this.currentUser.dob = data.dob;

    this.http.patch(`${this.dataUrl}/${id}`, {
      fullName: data.fullName,
      gender: data.gender,
      dob: data.dob
    }).subscribe();

    return true;
  }

  updateProfileImage(base64Image: string): boolean {
    if (!this.currentUser) return false;

    const id = this.currentUser.id;
    this.currentUser.profileImage = base64Image;

    this.http
      .patch(`${this.dataUrl}/${id}`, { profileImage: base64Image })
      .subscribe();

    return true;
  }

  changePassword(currentPassword: string, newPassword: string): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.password !== currentPassword) return false;

    const id = this.currentUser.id;
    this.currentUser.password = newPassword;

    this.http
      .patch(`${this.dataUrl}/${id}`, { password: newPassword })
      .subscribe();

    return true;
  }

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

  isInWishlist(gameId: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.wishlist.includes(gameId);
  }

  toggleWishlist(gameId: string): void {
    if (!this.currentUser) return;

    if (this.isInWishlist(gameId)) {
      this.removeFromWishlist(gameId);
    } else {
      this.addToWishlist(gameId);
    }
  }

  addToWishlist(gameId: string): void {
    if (!this.currentUser) return;
    if (this.currentUser.wishlist.includes(gameId)) return;

    this.currentUser.wishlist.push(gameId);

    this.http
      .patch(`${this.dataUrl}/${this.currentUser.id}`, {
        wishlist: this.currentUser.wishlist
      })
      .subscribe();
  }

  removeFromWishlist(gameId: string): void {
    if (!this.currentUser) return;

    this.currentUser.wishlist =
      this.currentUser.wishlist.filter(id => id !== gameId);

    this.http
      .patch(`${this.dataUrl}/${this.currentUser.id}`, {
        wishlist: this.currentUser.wishlist
      })
      .subscribe();
  }

  private ensureLibrary(): string[] {
    if (!this.currentUser) return [];
    const u: any = this.currentUser as any;

    if (!Array.isArray(u.library)) {
      u.library = [];
    }
    return u.library as string[];
  }

  getLibraryIds(): string[] {
    if (!this.currentUser) return [];
    return [...this.ensureLibrary()];
  }

  isInLibrary(gameId: string): boolean {
    if (!this.currentUser) return false;
    return this.ensureLibrary().includes(gameId);
  }

  toggleLibrary(gameId: string): void {
    if (!this.currentUser) return;

    if (this.isInLibrary(gameId)) {
      this.removeFromLibrary(gameId);
    } else {
      this.addToLibrary(gameId);
    }
  }

  addToLibrary(gameId: string): void {
    if (!this.currentUser) return;

    const lib = this.ensureLibrary();
    if (lib.includes(gameId)) return;

    lib.push(gameId);

    this.http
      .patch(`${this.dataUrl}/${this.currentUser.id}`, { library: lib })
      .subscribe();
  }

  removeFromLibrary(gameId: string): void {
    if (!this.currentUser) return;

    const lib = this.ensureLibrary().filter(id => id !== gameId);
    (this.currentUser as any).library = lib;

    this.http
      .patch(`${this.dataUrl}/${this.currentUser.id}`, { library: lib })
      .subscribe();
  }
}
