import { Component, OnInit } from '@angular/core';
import { ArtistaService } from '../../services/artistas/artistas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artista-section',
  templateUrl: './artista-section.component.html',
  styleUrls: ['./artista-section.component.css']
})
export class ArtistaSectionComponent implements OnInit {
  artists: any[] = [];
  emergentes: any[] = [];
  nacionales: any[] = [];
  internacionales: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private artistaService: ArtistaService, private router: Router) {}

  ngOnInit() {
    this.loadArtists();
  }

  private isEcuadorian(nacionalidad: string): boolean {
    return nacionalidad?.toLowerCase().trim() === 'ecuador';
  }

  loadArtists() {
    this.isLoading = true;
    this.artistaService.obtenerTodosArtistas().subscribe({
      next: (artistas) => {
        if (Array.isArray(artistas)) {
          this.artists = artistas;
          
          // Clasificar artistas
          this.emergentes = [...this.artists];
          
          // Filtrar nacionales (Ecuador)
          this.nacionales = this.artists.filter(artista => 
            this.isEcuadorian(artista.nacionalidad)
          );
          
          // Filtrar internacionales (no Ecuador)
          this.internacionales = this.artists.filter(artista => 
            !this.isEcuadorian(artista.nacionalidad) && 
            artista.nacionalidad !== 'No especificada'
          );

        } else {
          this.error = 'No se encontraron artistas';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar artistas:', err);
        this.error = 'Error al cargar los artistas';
        this.isLoading = false;
      },
    });
  }

  contratarArtista(artista: any) {
    this.router.navigate(['/artista-view'], { queryParams: { id: artista.id } });
  }
}