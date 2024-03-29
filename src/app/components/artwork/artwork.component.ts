import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IArtwork } from '../../interfaces/i-artwork';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-artwork',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artwork.component.html',
  styleUrl: './artwork.component.css',
})
export class ArtworkComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private apiService: ApiServiceService,
    private titleService: Title
  ) {}
  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        //Cambiar el nombre cuando se accedan a detalles
        this.titleService.setTitle('DETAIL');
        //Realizar la carga del componente solicitado
        this.loadArtWork([id]);
      }
    });
  }

  loadArtWork(id: string[]): void {
    this.apiService.getArtworksFromIDs(id).subscribe(
      (artworks) => {
        this.artwork = artworks[0];
        console.log(this.artwork);
      },
      (error) => {
        console.error('Error al cargar el arte', error);
      }
    );
  }

  showFullDescription = false;
  mouseover: boolean = false;
  @Input() artwork!: IArtwork;
  @Input() id?: string;
  
  @Output() likeChanged = new EventEmitter<boolean>();
  
  toggleLike() {
    this.likeChanged.emit(this.artwork.like);
  }
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}
