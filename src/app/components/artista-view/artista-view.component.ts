    import { Component, OnInit } from '@angular/core';
    import { Router, ActivatedRoute } from '@angular/router';
    import { ArtistaService } from 'src/app/services/artistas/artistas.service';
    import { ObrasService } from 'src/app/services/obras/obras.service';
    import { FavoritosService } from 'src/app/services/favoritos/favoritos.service';

    @Component({
      selector: 'app-artista-view',
      templateUrl: './artista-view.component.html'
    })
    export class ArtistaViewComponent implements OnInit {
      artista: any = {
        user_id: { name: '' },
        biografia: '',
        telefono: '',
        correo: '',
        redes_sociales: { instagram: '', facebook: '' },
        imagen: '',
        _id: '',
        blockStatus: null
      };

      obras: any[] = [];
      isLoading = false;
      isPublicView = false;
      favoritos: Set<string> = new Set();

      constructor(
        private artistaService: ArtistaService,
        private obrasService: ObrasService,
        private favoritosService: FavoritosService,
        private router: Router,
        private route: ActivatedRoute
      ) {}

      ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
          if (params['id']) {
            this.isPublicView = true;
            this.cargarDatosArtistaPublico(params['id']);
          } else {
            this.cargarDatosArtista();
          }
        });
        this.cargarFavoritos();
      }

      cargarDatosArtistaPublico(artistaId: string): void {
        this.isLoading = true;
        this.artistaService.obtenerArtistaPorId(artistaId).subscribe({
          next: (data) => {
            if (data) {
              this.artista = data;
              // Solo cargar obras si el artista no está bloqueado por el admin
              if (!this.artista.blockStatus?.isBlocked || this.artista.blockStatus?.blockReason === 'Pendiente de aprobación por el administrador') {
                this.cargarObras(data._id);
              }
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al obtener el artista:', error);
            this.isLoading = false;
          }
        });
      }

      cargarDatosArtista(): void {
        this.isLoading = true;
        this.artistaService.obtenerArtista().subscribe({
          next: (data) => {
            if (data) {
              this.artista = data;
              // Solo cargar obras si el artista no está bloqueado por el admin
              if (!this.artista.blockStatus?.isBlocked || this.artista.blockStatus?.blockReason === 'Pendiente de aprobación por el administrador') {
                this.cargarObras(data._id);
              }
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al obtener el artista:', error);
            this.isLoading = false;
          }
        });
      }

      cargarObras(artistaId: string): void {
        // No cargar obras si el artista está bloqueado por el admin
        if (this.artista.blockStatus?.isBlocked && this.artista.blockStatus?.blockReason !== 'Pendiente de aprobación por el administrador') {
          return;
        }
        
        const request = this.isPublicView ? 
          this.obrasService.getObrasArtistaPublic(artistaId) :
          this.obrasService.getObrasArtista(artistaId);
      
        request.subscribe({
          next: (data) => {
            this.obras = data;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al cargar las obras:', error);
            this.isLoading = false;
          }
        });
      }

      cargarFavoritos() {
        if (this.isPublicView) {
          this.favoritosService.obtenerMisFavoritos().subscribe({
            next: (data) => {
              this.favoritos = new Set(data.map((fav: any) => fav.obra_id._id));
            },
            error: (error) => console.error('Error al cargar favoritos:', error)
          });
        }
      }

      toggleFavorito(obra: any) {
        // No permitir favoritos si el artista está bloqueado por el admin
        if (this.artista.blockStatus?.isBlocked && this.artista.blockStatus?.blockReason !== 'Pendiente de aprobación por el administrador') {
          return;
        }
        
        this.favoritosService.toggleFavorito(obra._id).subscribe({
          next: () => {
            if (this.favoritos.has(obra._id)) {
              this.favoritos.delete(obra._id);
            } else {
              this.favoritos.add(obra._id);
            }
          },
          error: (error) => console.error('Error al gestionar favorito:', error)
        });
      }

      isFavorito(obraId: string): boolean {
        return this.favoritos.has(obraId);
      }

      editarObra(obraId: string): void {
        // No permitir edición si el artista está bloqueado por el admin
        if (this.artista.blockStatus?.isBlocked && this.artista.blockStatus?.blockReason !== 'Pendiente de aprobación por el administrador') {
          return;
        }
        
        if (obraId) {
          this.router.navigate(['/update-obras', obraId]);
        }
      }

      eliminarObra(obraId: string): void {
        // No permitir eliminación si el artista está bloqueado por el admin
        if (this.artista.blockStatus?.isBlocked && this.artista.blockStatus?.blockReason !== 'Pendiente de aprobación por el administrador') {
          return;
        }
        
        if (confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
          this.isLoading = true;
          this.obrasService.eliminarObra(obraId).subscribe({
            next: () => {
              this.obras = this.obras.filter(obra => obra._id !== obraId);
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error al eliminar la obra:', error);
              this.isLoading = false;
            }
          });
        }
      }

      redirectToUpdateBio(): void {
        // No permitir actualización si el artista está bloqueado por el admin
        if (this.artista.blockStatus?.isBlocked && this.artista.blockStatus?.blockReason !== 'Pendiente de aprobación por el administrador') {
          return;
        }
        this.router.navigate(['/update-bio']);
      }

      redirectToUpdateObras(): void {
        // No permitir actualización si el artista está bloqueado por el admin
        if (this.artista.blockStatus?.isBlocked && this.artista.blockStatus?.blockReason !== 'Pendiente de aprobación por el administrador') {
          return;
        }
        this.router.navigate(['/update-obras']);
      }
      
      redirectToHome(): void {
        this.router.navigate(['/home']);
      }
    }