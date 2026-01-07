// src/app/modules/users.ts

export class User {
  id!: number;
  fullName!: string;
  email!: string;
  password!: string;
  role!: 'admin' | 'user';
  birthDate!: string;
  createdAt!: string;
  isBlocked!: boolean;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
