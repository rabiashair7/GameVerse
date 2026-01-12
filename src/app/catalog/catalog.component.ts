import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  selectedCategory: string = 'all';

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }
}
