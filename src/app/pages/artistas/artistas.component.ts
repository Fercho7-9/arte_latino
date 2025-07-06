import { Component, OnInit } from '@angular/core';
import { ArtistaService } from '../../services/artistas/artistas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-artistas',
  templateUrl: './artistas.component.html'
})
export class ArtistasComponent implements OnInit {
  emergentes: any[] = [];
  nacionales: any[] = [];
  internacionales: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private artistaService: ArtistaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArtists();
    this.handleScrollToSection();
  }

  contratarArtista(artista: any) {
    this.router.navigate(['/artista-view'], { queryParams: { id: artista.id } });
  }

  private handleScrollToSection() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  private isEcuadorian(nacionalidad: string): boolean {
    return nacionalidad?.toLowerCase().trim() === 'ecuador';
  }

  private loadArtists() {
    this.isLoading = true;
    this.artistaService.obtenerTodosArtistas().subscribe({
      next: (artistas) => {
        if (Array.isArray(artistas)) {
          console.log('Artistas recibidos:', artistas);
          
          // Todos los artistas son emergentes inicialmente
          this.emergentes = [...artistas];
          
          // Filtrar nacionales (Ecuador)
          this.nacionales = artistas.filter(artista => 
            this.isEcuadorian(artista.nacionalidad)
          );
          
          // Filtrar internacionales (no Ecuador)
          this.internacionales = artistas.filter(artista => 
            !this.isEcuadorian(artista.nacionalidad) && 
            artista.nacionalidad !== 'No especificada'
          );

          console.log('Nacionales:', this.nacionales);
          console.log('Internacionales:', this.internacionales);
        } else {
          this.error = 'No se encontraron artistas';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar artistas:', err);
        this.error = 'Error al cargar los artistas';
        this.isLoading = false;
      }
    });
  }
}