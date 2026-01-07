export class Game {

  constructor(
    public id: number,
    public title: string,
    public description: string,
    public developer: string,
    public price: number,
    public category: string,
    public releaseDate: string,
    public coverImage: string,
    public unitsSold: number,
    public rating: number,
    public tags: string[],
    public createdAt: string
  ) {}

  isFree(): boolean {
    return this.price === 0;
  }
}
