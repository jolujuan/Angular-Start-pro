import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { IArtwork } from '../../interfaces/i-artwork';
import { ApiServiceService } from '../../services/api-service.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UsersServiceService } from '../../services/users.service.service';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';
import { Router } from '@angular/router';

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
    private dataService: ApiServiceService,
    private titleService: Title,
    private router: Router,
    private usersService: UsersServiceService,
    private popupService: ShowPopUpServiceService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('FAVORITES');
    //Comprobar que este logueado para mostrar la vista
    this.usersService.isLogged().then((logged) => {
      if (!logged) this.showPopUp('favorites', 'userManagement/login');
      else {
        this.quadres = this.dataService.datos; //Recuperar los datos del servicio
        this.noHayLikes = this.quadres.every((quadre) => !quadre.like); //Comprobar si existen los datos
      }
    });
  }

  quadres: IArtwork[] = [];
  noHayLikes: boolean = false;

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      this.router.navigate([ruta]);
    });
  }
}
