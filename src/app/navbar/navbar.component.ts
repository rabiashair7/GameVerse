import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchServiceService } from '../searchService.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showCategories = false;

  categories: string[] = [
    'Action',
    'RPG',
    'Sports',
    'Racing',
    'Adventure',
    'Indie'
  ];

  constructor(
    private router: Router,
    private searchService: SearchServiceService
  ) {}

  toggleCategories(): void {
    this.showCategories = !this.showCategories;
  }

  goToAllGames(): void {
    this.showCategories = false;
    this.router.navigate(['/store']);
  }

  goToCategory(category: string): void {
    this.showCategories = false;
    this.router.navigate([`/type/${category.toLowerCase()}/store`]);
  }

  updateSearch(value: string): void {
    this.searchService.setSearch(value);
  }

  goToWishlist(): void {
    this.router.navigate(['/wishlist/store']);
  }

  goToCart(): void {
    this.router.navigate(['/cart/store']);
  }
}
