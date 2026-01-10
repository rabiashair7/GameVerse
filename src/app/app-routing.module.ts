import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Core pages */
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { CatalogComponent } from './catalog/catalog.component';
/* User pages */
import { LibraryComponent } from './library/library.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';

/* Admin & auth */
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

/* Game */
import { GameCardComponent } from './gamecard/gamecard.component';

/* Info */
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './notfound/notfound.component';

const routes: Routes = [
 /* Default */
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  /* Store */
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent},
  { path: 'category/:name', component: CategoryComponent },
  { path: 'game/:id', component: GameCardComponent },

  /* User */
  { path: 'library', component: LibraryComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },

  /* Info */
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* Admin */
  { path: 'admin', component: AdminComponent },

  /* 404 – MUST BE LAST */
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
