export class User {
  id!: number;
  fullName!: string;
  email!: string;
  password!: string;
  gender!: 'male' | 'female';
  dob!: string;
  role!: 'admin' | 'user';
  banned!: boolean;
  createdAt!: string;

  // ❤️ WISHLIST (game IDs)
  wishlist: number[] = [];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);

    // ✅ Ensure wishlist is always initialized
    if (!this.wishlist) {
      this.wishlist = [];
    }
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
