export type CartItem = {
  gameId: string;  
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

  profileImage?: string | null;

  wishlist: string[] = [];

  cart: CartItem[] = [];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);

    if (!this.wishlist) {
      this.wishlist = [];
    }

    if (!this.cart) {
      this.cart = [];
    }

    if (this.profileImage === undefined) {
      this.profileImage = null;
    }
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
