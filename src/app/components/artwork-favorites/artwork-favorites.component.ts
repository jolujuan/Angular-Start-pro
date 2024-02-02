import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IArtwork } from '../../interfaces/i-artwork';
import { ApiServiceService } from '../../services/api-service.service';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';
import { UsersServiceService } from '../../services/users.service.service';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';

@Component({
  selector: 'app-artwork-favorites',
  standalone: true,
  imports: [ArtworkRowComponent, CommonModule],
  templateUrl: './artwork-favorites.component.html',
  styleUrl: './artwork-favorites.component.css',
})
export class ArtworkFavoritesComponent implements OnInit {
  @ViewChild('divPopUp') divPopUp: ElementRef | undefined;

  constructor(
    private titleService: Title,
    private router: Router,
    private usersService: UsersServiceService,
    private apiService: ApiServiceService,
    private popupService: ShowPopUpServiceService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('FAVORITES');
    //Comprobar que este logueado para mostrar la vista
    this.usersService.isLogged().then((logged) => {
      if (!logged) {
        this.showPopUp('favorites', 'userManagement/login');
      } else {
        this.loadFavorites();
      }
    });
  }

  loadFavorites(): void {
    this.usersService.isLogged().then((logged) => {
      if (!logged) this.showPopUp('favorites', 'userManagement/login');
      else {
        this.usersService.favoritesSubject.subscribe((data) => {
          //Convertir el resultado de la promesa en un array para iterar
          if (data.length === 0)
            this.noHayLikes = this.quadresFav.every((quadre) => !quadre.like); //Comprobar si existen los datos

          let artworksIds = data.map((item) => item.artwork_id);

          this.apiService //Convertirlo a la lista de strings artorks ids devueltos
            .getArtworksFromIDs(artworksIds)
            .subscribe((artworkList: IArtwork[]) => {
              this.quadresFav = artworkList;
            });
        });
      }
      this.usersService.getFavorites();
    });
  }

  quadresFav: IArtwork[] = [];
  noHayLikes: boolean = false;

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      this.router.navigate([ruta]);
    });
  }
}
