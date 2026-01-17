import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../gameService.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../userService.service';
import { CartService } from '../cart.service'; // ✅ NEW

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.css']
})
export class GameCardComponent implements OnInit {

  game: any | null = null;
  loading = true;
  error = '';

  selectedImage = '';
  allImages: string[] = [];
  safeVideos: SafeResourceUrl[] = [];

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserService,
    private cartService: CartService // ✅ NEW
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.error = 'Invalid game ID';
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = '';

      this.gameService.getGameById(id).subscribe({
        next: game => {
          this.game = game;

          this.allImages = [
            game.image,
            ...(game.images || [])
          ];

          this.selectedImage = this.allImages[0];
          this.prepareVideos(game.videos);
          this.loading = false;
        },
        error: () => {
          this.error = 'Game not found';
          this.loading = false;
        }
      });
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  private prepareVideos(videos: string[] = []): void {
    this.safeVideos = videos.map(url => {
      const match = url.match(/v=([^&]+)/);
      const embedUrl = match
        ? `https://www.youtube.com/embed/${match[1]}`
        : url;

      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    });
  }

  /* =============================
     🛒 CART
     ============================= */
  addToCart(): void {
    if (!this.game) return;

    this.cartService.addToCart({
      gameId: String(this.game.id),
      title: this.game.title,
      price: this.game.price,
      image: this.game.image
    }, 1);
  }

  isInCart(): boolean {
    if (!this.game) return false;
    return this.cartService.isInCart(String(this.game.id));
  }

  /* =============================
     ❤️ WISHLIST
     ============================= */
  addToWishlist(): void {
    if (!this.game) return;
    this.userService.addToWishlist(this.game.id); // keep existing logic
  }

  isInWishlist(): boolean {
    if (!this.game) return false;
    return this.userService.isInWishlist(this.game.id);
  }

  /* =============================
     ⬅ NAVIGATION
     ============================= */
  goHome(): void {
    this.router.navigate(['/home']);
  }
}
