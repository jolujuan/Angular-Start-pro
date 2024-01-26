import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArtworkListComponent } from '../artwork-list/artwork-list.component';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ArtworkListComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
