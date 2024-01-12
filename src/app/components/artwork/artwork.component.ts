import { Component, Input } from '@angular/core';
import { IArtwork } from '../../interfaces/i-artwork';

@Component({
  selector: 'app-artwork',
  standalone: true,
  imports: [],
  templateUrl: './artwork.component.html',
  styleUrl: './artwork.component.css'
})
export class ArtworkComponent {
@Input() artwork?:IArtwork;
}
