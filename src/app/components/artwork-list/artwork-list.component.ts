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

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [CommonModule, ArtworkComponent, ArtworkRowComponent, ArtworkFilterPipe],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css',
})
export class ArtworkListComponent implements OnInit {

  constructor(private artService: ApiServiceService,
    private filterService: FilterService, private titleService: Title) {  }

  ngOnInit(): void {
    this.titleService.setTitle('HOME');

    if (this.onlyFavorites != 'favorites') {
      /* llamar a la peticion de datos y manejarlos mediante la suscripcion del observable */
      this.artService.getArtWorks().subscribe(
        (artworkList: IArtwork[]) => {
          this.artService.datos=artworkList; //Guardar los datos en el servicio

          this.quadres = artworkList;
        });
    }


    this.filterService.searchFilter.pipe(
      //filter(f=> f.length> 4 || f.length ===0),
      debounceTime(500)
    ).subscribe(filter => this.artService.filterArtWorks(filter));
  }


  toggleLike($event: boolean, artwork: IArtwork) {
    artwork.like = !artwork.like;
  }

  filter: string = "";
  quadres: IArtwork[] = [];
  @Input() onlyFavorites: string = '';

}
