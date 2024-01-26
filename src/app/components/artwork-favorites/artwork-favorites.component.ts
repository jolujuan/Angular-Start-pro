import { Component, OnInit } from '@angular/core';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { IArtwork } from '../../interfaces/i-artwork';
import { ApiServiceService } from '../../services/api-service.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artwork-favorites',
  standalone: true,
  imports: [ArtworkRowComponent, CommonModule],
  templateUrl: './artwork-favorites.component.html',
  styleUrl: './artwork-favorites.component.css'
})
export class ArtworkFavoritesComponent implements OnInit {
  constructor(private dataService: ApiServiceService, private titleService: Title) {
  
   }

  ngOnInit(): void {
    this.titleService.setTitle('FAVORITES');
    this.quadres=this.dataService.datos; //Recuperar los datos del servicio
    this.noHayLikes= this.quadres.every(quadre=>!quadre.like); //Comprobar si existen los datos
  }
  
  quadres: IArtwork[] = [];
  noHayLikes:boolean=false;

}
