import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Core pages */
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { CategoryComponent } from './category/category.component';

/* User pages */
import { LibraryComponent } from './library/library.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';

/* Admin & auth */
import { AdminComponent } from './admin/admin.component';

/* Info */
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [

  /* Default */
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  /* Store / Public */
  { path: 'home', component: HomeComponent },
  { path: 'games', component: GamesComponent },
  { path: 'category/:name', component: CategoryComponent },

  /* User */
  { path: 'library', component: LibraryComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },

  /* Info */
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent},

  /* Admin */
  { path: 'admin', component: AdminComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
