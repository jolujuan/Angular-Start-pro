import { Routes } from '@angular/router';
import { ArtworkFavoritesComponent } from './components/artwork-favorites/artwork-favorites.component';
import { ArtworkListComponent } from './components/artwork-list/artwork-list.component';
import { ArtworkComponent } from './components/artwork/artwork.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'artworks', component: ArtworkListComponent },
  { path: 'artworks/:search', component: ArtworkListComponent },
  { path: 'artwork/:id', component: ArtworkComponent },
  { path: 'favorites', component: ArtworkFavoritesComponent },
  { path: 'userManagement/:setmode', component: LoginComponent },
  { path: 'userManagement/:logout', component: LoginComponent },
    { path: '**', component: ArtworkListComponent } 
  
];
