import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IArtwork } from '../../interfaces/i-artwork';
import { ArtworkFilterPipe } from '../../pipes/artwork-filter.pipe';
import { ApiServiceService } from '../../services/api-service.service';
import { FilterService } from '../../services/filter.service';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { ArtworkComponent } from '../artwork/artwork.component';
import { debounceTime } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [CommonModule, ArtworkComponent, ArtworkRowComponent, ArtworkFilterPipe, FormsModule],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css',
})
export class ArtworkListComponent implements OnInit {

  constructor(private artService: ApiServiceService,
    private filterService: FilterService, private titleService: Title) {

  }

  ngOnInit(): void {
    /* Consultar el total de paginas */
    this.artService.getArtWorksAll().subscribe(totalPages => {
      this.totalPage = totalPages;
    });
    this.titleService.setTitle('HOME');

    if (this.onlyFavorites != 'favorites') {
      /* llamar a la peticion de datos y manejarlos mediante la suscripcion del observable */
      this.artService.getArtWorks().subscribe(
        (artworkList: IArtwork[]) => {
          this.artService.datos = artworkList; //Guardar los datos en el servicio

          this.quadres = artworkList;
        });
    }

    this.filterService.searchFilter.pipe(
      //filter(f=> f.length> 4 || f.length ===0),
      debounceTime(500)
    ).subscribe(filter => { 
      console.log(" filtre ",filter)
      this.artService.filterArtWorks(filter) });
  }


  toggleLike($event: boolean, artwork: IArtwork) {
    artwork.like = !artwork.like;
  }

  filter: string = "cats";
  quadres: IArtwork[] = [];
  @Input() onlyFavorites: string = '';
  mouseover: boolean = false
  contPage: number = 1;
  totalPage: number = 0;
  pageNumber!: number;

  /* Funcion para mostrar las diferentes paginas */
  paginate(param: string) {

    switch (param) {
      case "back":
        if (this.contPage != 1) {
          this.contPage--;
        }
        break;

      case "next":
        this.contPage++;
        break;

      case "pageNumber":
        this.contPage = this.pageNumber;
        break;
    }


    console.log("numero pagina ", this.contPage)
    const url = `https://api.artic.edu/api/v1/artworks?page=${this.contPage}`;
    this.artService.getArtWorksPage(url).subscribe(
      (artworkList: IArtwork[]) => {
        this.artService.datos = artworkList; //Guardar los datos en el servicio
        this.quadres = artworkList;
      });
  }
}
