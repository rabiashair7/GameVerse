import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showStoreNavbar = true;

  private hideNavbarOn: string[] = ['/login', '/register', '/admin'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects.split('?')[0];
        this.showStoreNavbar = !this.hideNavbarOn.some(x => url.startsWith(x));
      });
  }
}

