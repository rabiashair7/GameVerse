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

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
