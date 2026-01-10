import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {

  selectedCategory: string = 'all';

  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }
}
