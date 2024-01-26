import { Pipe, PipeTransform } from '@angular/core';
import { IArtwork } from '../interfaces/i-artwork';

@Pipe({
  name: 'artworkFilter',
  standalone: true
})
export class ArtworkFilterPipe implements PipeTransform {

  transform(artworks: IArtwork[], filter:string): IArtwork[] {
    return artworks.filter(aw => aw.title.toLowerCase().includes(filter)||aw.description?.toLowerCase().includes(filter));
  }

}
