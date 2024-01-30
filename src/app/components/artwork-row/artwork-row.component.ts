import { Component, Input } from '@angular/core';
import { IArtwork } from '../../interfaces/i-artwork';

@Component({
  /* en corxetes per no mostrar en el codi */
  selector: '[app-artwork-row]',
  standalone: true,
  imports: [],
  templateUrl: './artwork-row.component.html',
  styleUrl: './artwork-row.component.css',
})
export class ArtworkRowComponent {
  @Input() artwork!: IArtwork;
}
