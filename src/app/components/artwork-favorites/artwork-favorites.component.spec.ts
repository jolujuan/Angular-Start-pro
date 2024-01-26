import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkFavoritesComponent } from './artwork-favorites.component';

describe('ArtworkFavoritesComponent', () => {
  let component: ArtworkFavoritesComponent;
  let fixture: ComponentFixture<ArtworkFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtworkFavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtworkFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
