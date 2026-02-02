import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './userService.service';

@Injectable({ providedIn: 'root' })
export class LibraryService implements OnDestroy {
  private apiUsers = 'http://localhost:3001/users';

  private librarySubject = new BehaviorSubject<string[]>([]);
  library$ = this.librarySubject.asObservable();

  private userPoll?: any;
  private lastUserId: string | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.userPoll = setInterval(() => {
      const u: any = this.userService.getCurrentUser() as any;
      const uid = u ? String(u.id) : null;

      if (uid !== this.lastUserId) {
        this.lastUserId = uid;

        if (!uid) {
          this.librarySubject.next([]);
        } else {
          this.loadLibrary(uid);
        }
      }
    }, 250);
  }

  ngOnDestroy(): void {
    if (this.userPoll) clearInterval(this.userPoll);
  }

  private normId(id: any): string {
    return String(id ?? '').trim();
  }

  private getUserId(): string | null {
    const u: any = this.userService.getCurrentUser() as any;
    return u ? String(u.id) : null;
  }

  private ensureLibrary(items: any): string[] {
    if (!Array.isArray(items)) return [];
    return items
      .map((x: any) => this.normId(x))
      .filter(Boolean);
  }

  private loadLibrary(userId: string): void {
    this.http.get<any>(`${this.apiUsers}/${userId}`).subscribe({
      next: (user) => {
        const lib = this.ensureLibrary(user?.library);
        this.librarySubject.next(lib);
      },
      error: () => this.librarySubject.next([])
    });
  }

  private saveLibrary(ids: string[]): void {
    const userId = this.getUserId();

    const normalized = [...new Set(ids.map(x => this.normId(x)).filter(Boolean))];
    this.librarySubject.next(normalized);

    if (!userId) return;

    this.http
      .patch(`${this.apiUsers}/${userId}`, { library: normalized })
      .subscribe({
        next: () => {},
        error: () => {}
      });
  }

  // ===== PUBLIC METHODS =====

  getLibraryIds(): string[] {
    return this.librarySubject.value;
  }

  isInLibrary(gameId: string): boolean {
    const id = this.normId(gameId);
    return this.librarySubject.value.includes(id);
  }

  addToLibrary(gameId: string): void {
    const id = this.normId(gameId);
    if (!id) return;

    const lib = [...this.librarySubject.value];
    if (lib.includes(id)) return;

    lib.push(id);
    this.saveLibrary(lib);
  }

  removeFromLibrary(gameId: string): void {
    const id = this.normId(gameId);
    this.saveLibrary(this.librarySubject.value.filter(x => x !== id));
  }

  clearLibrary(): void {
    this.saveLibrary([]);
  }
}
