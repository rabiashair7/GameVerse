export class CartItem {
  gameId!: string;
  title!: string;
  price!: number;
  image!: string;
  qty!: number;

  constructor(data?: Partial<CartItem>) {
    Object.assign(this, data);

    this.gameId = String(this.gameId ?? '').trim();
    this.title = String(this.title ?? '');
    this.price = Number(this.price) || 0;
    this.image = String(this.image ?? '');
    this.qty = Math.max(1, Math.floor(Number(this.qty) || 1));
  }
}
