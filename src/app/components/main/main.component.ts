import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArtworkListComponent } from '../artwork-list/artwork-list.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ArtworkListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
