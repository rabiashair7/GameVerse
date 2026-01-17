export type CartItem = {
  gameId: string;   // keep as string (works with "4207", "fdd4", etc.)
  title: string;
  price: number;
  image?: string;
  qty: number;
};

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

  // 🖼️ PROFILE IMAGE (Base64)
  profileImage?: string | null;

  // ❤️ WISHLIST (game IDs — MUST be strings)
  wishlist: string[] = [];

  // 🛒 CART (persisted per user)
  cart: CartItem[] = [];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);

    // ✅ Ensure wishlist is always initialized
    if (!this.wishlist) {
      this.wishlist = [];
    }

    // ✅ Ensure cart is always initialized
    if (!this.cart) {
      this.cart = [];
    }

    // ✅ Ensure profileImage exists (optional)
    if (this.profileImage === undefined) {
      this.profileImage = null;
    }
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
