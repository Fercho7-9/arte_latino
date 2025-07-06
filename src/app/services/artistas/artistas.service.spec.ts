import { TestBed } from '@angular/core/testing';
import { ArtistaService } from './artistas.service';


describe('ArtistasService', () => {
  let service: ArtistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
