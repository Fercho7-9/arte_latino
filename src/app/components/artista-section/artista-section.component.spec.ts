import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaSectionComponent } from './artista-section.component';

describe('ArtistaSectionComponent', () => {
  let component: ArtistaSectionComponent;
  let fixture: ComponentFixture<ArtistaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistaSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
