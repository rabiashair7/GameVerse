import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {
  private searchTerm = '';

  setSearch(term: string) {
    this.searchTerm = term;
  }

  getSearch() {
    return this.searchTerm;
  }
}
