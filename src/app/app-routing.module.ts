import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { CatalogComponent } from './catalog/catalog.component';


import { LibraryComponent } from './library/library.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDetailsComponent } from './user-details/user-details.component';


import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


import { GameCardComponent } from './gamecard/gamecard.component';


import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'category/:name', component: CategoryComponent },
  { path: 'game/:id', component: GameCardComponent },


  { path: 'library', component: LibraryComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },

  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: UserDetailsComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'cart', component: CartComponent }
    ]
  },


  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  
  { path: 'admin', component: AdminComponent },

  
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
