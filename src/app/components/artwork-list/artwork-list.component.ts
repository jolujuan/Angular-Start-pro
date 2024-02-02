import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { IArtwork } from '../../interfaces/i-artwork';
import { ArtworkFilterPipe } from '../../pipes/artwork-filter.pipe';
import { ApiServiceService } from '../../services/api-service.service';
import { FilterService } from '../../services/filter.service';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';
import { UsersServiceService } from '../../services/users.service.service';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { ArtworkComponent } from '../artwork/artwork.component';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [
    CommonModule,
    ArtworkComponent,
    ArtworkRowComponent,
    ArtworkFilterPipe,
    FormsModule,
  ],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css',
})
export class ArtworkListComponent {
  @ViewChild('divPopUp') divPopUp: ElementRef | undefined;

  constructor(
    private usersService: UsersServiceService,

    private router: ActivatedRoute,
    private artService: ApiServiceService,
    private filterService: FilterService,
    private titleService: Title,
    private popupService: ShowPopUpServiceService,
    private routerPop: Router
  ) {
    this.isSearchActive = false;
  }

  ngOnInit(): void {
    this.titleService.setTitle('HOME');

    this.setSearch();
    this.updateTotalPage();

    /* Si no se ha realizado busqueda mostrar todos */
    if (!this.isSearchActive) {
      /* llamar a la peticion de datos y manejarlos mediante la suscripcion del observable */
      this.artService.getArtWorks().subscribe((artworkList: IArtwork[]) => {
        this.quadres = artworkList;
      });
    } else {
      //Logica para cuando esta buscando
      this.filterService.searchFilter
        .pipe(debounceTime(500))
        .subscribe((filter) => {
          console.log('Filtro:', filter);
          this.artService
            .filterArtWorks(filter)
            .subscribe((artworkList: IArtwork[]) => {
              this.quadres = artworkList;
            });
        });
      this.filterService.searchFilter.next(this.filter); //Emitir el dato para el consumo
    }
  }

  /* Consultar el total de paginas */
  updateTotalPage(): void {
    let urlSearch = this.isSearchActive
      ? `${this.url}/search?q=${this.filter}`
      : this.url;
    this.artService.getArtWorksAll(urlSearch).subscribe((totalPages) => {
      this.totalPage = totalPages;
      //Haciendo pruebas comprobe que no puedes realizar paginacion despues de la pagina 100 tras haber buscado un elemento
      if (this.isSearchActive)
        this.totalPage = this.totalPage >= 100 ? 100 : this.totalPage;
      this.currentPage = 1; //Reinicia pagina actual para una nueva busqueda
    });
  }

  /* Realizar la busqueda */
  setSearch(): void {
    this.router.paramMap.subscribe((params) => {
      const seachFilter = params.get('search');
      if (seachFilter) {
        this.filter = seachFilter; //Guardar el filtro pasado en el componente
        this.isSearchActive = true; //Activamos la busqueda
        this.updateTotalPage(); //Actualizar la cantidad de paginas
        this.filterService.searchFilter.next(this.filter); //Emitir el dato para el consumo
      }
    });
  }

  async toggleLike($event: boolean, artwork: IArtwork) {
    this.usersService.isLogged().then((logged) => {
      if (!logged) this.showPopUp('favoritesSave', 'userManagement/login');
      else {
        artwork.like = !artwork.like;
        this.usersService.setFavorites(artwork.id + '');
      }
    });
  }

  filter: string = '';
  quadres: IArtwork[] = [];
  mouseover: boolean = false;

  currentPage: number = 1;
  totalPage!: number;
  numberPage!: number;

  url: string = `https://api.artic.edu/api/v1/artworks`;
  isSearchActive: boolean = false;

  /* Funcion para mostrar las diferentes paginas */
  paginate(param: string) {
    switch (param) {
      case 'back':
        if (this.currentPage != 1) this.currentPage--;
        break;

      case 'next':
        if (this.currentPage < this.totalPage) this.currentPage++;
        break;

      case 'numberPage':
        if (this.numberPage <= this.totalPage && this.numberPage >= 1)
          this.currentPage = this.numberPage;
        break;
    }
    /* Comprobar si debe paginar en todas las paginas o solo en las que hay una busqueda especifica */
    let urlSearch = this.isSearchActive
      ? `${this.url}/search?q=${this.filter}&fields=id,description,title,image_id&page=${this.currentPage}`
      : `${this.url}?page=${this.currentPage}`;

    console.log(urlSearch);

    this.artService
      .getArtWorksPage(urlSearch)
      .subscribe((artworkList: IArtwork[]) => {
        // this.artService.datos = artworkList; //Guardar los datos en el servicio
        this.quadres = artworkList;
        window.scrollTo(0, 0);
      });
  }

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      this.routerPop.navigate([ruta]);
    });
  }
}
