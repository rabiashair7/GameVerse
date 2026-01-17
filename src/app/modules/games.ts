export class Game {

  constructor(
    public id: string,
    public title: string,
    public developer: string,
    public price: number,
                  
    public image: string,
    public images: string[] = [],
    public videos: string[] = [],
    public categories: string[] = [],

    public details: string = '',
    public releaseDate: string = '',
    public unitsSold: string = '',
    public rating: number | null = null,
    public popular: boolean = false
  ) {}

  isFree(): boolean {
    return this.price === 0;
  }
}
