import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ComprasService } from '../../services/compras/compras.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario-view',
  templateUrl: './usuario-view.component.html'
})
export class UsuarioViewComponent implements OnInit, OnDestroy {
  user: any = {
    name: '',
    email: '',
    nacionalidad: '',
    imagen: '',
    blockStatus: {
      isBlocked: false,
      blockReason: '',
      blockedAt: null
    }
  };
  compras: any[] = [];
  favoritos: any[] = [];
  isLoading = false;
  isPublicView = false;
  isAdminView = false;
  private userDataSubscription: Subscription;

  constructor(
    private userService: UserService,
    private comprasService: ComprasService,
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userDataSubscription = this.authService.userData$.subscribe(userData => {
      if (userData && !this.isPublicView) {
        this.user = {
          ...userData,
          blockStatus: userData.blockStatus || {
            isBlocked: false,
            blockReason: '',
            blockedAt: null
          }
        };
        if (!this.user.blockStatus?.isBlocked) {
          this.cargarCompras();
          this.cargarFavoritos();
        }
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isAdminView = params['isAdmin'] === 'true';
      if (params['id']) {
        this.isPublicView = true;
        this.cargarDatosUsuarioPublico(params['id']);
      } else {
        this.loadUserData();
      }
    });
  }
  cargarDatosUsuarioPublico(userId: string): void {
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        if (data) {
          this.user = {
            ...data,
            blockStatus: data.blockStatus || {
              isBlocked: false,
              blockReason: '',
              blockedAt: null
            }
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  loadUserData() {
    const userData = this.userService.getCurrentUser();
    if (userData) {
      this.user = {
        ...userData,
        blockStatus: userData.blockStatus || {
          isBlocked: false,
          blockReason: '',
          blockedAt: null
        }
      };
      this.authService.updateAuthState(true, this.user);
      if (!this.user.blockStatus?.isBlocked) {
        this.cargarCompras();
        this.cargarFavoritos();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarCompras() {
    if (this.user.blockStatus?.isBlocked) return;
    
    this.isLoading = true;
    this.comprasService.obtenerMisCompras().subscribe({
      next: (compras) => {
        this.compras = compras;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar compras:', error);
        this.isLoading = false;
      }
    });
  }

  cargarFavoritos() {
    if (this.user.blockStatus?.isBlocked) return;
    
    this.favoritosService.obtenerMisFavoritos().subscribe({
      next: (favoritos) => {
        this.favoritos = favoritos;
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
      }
    });
  }

  getImageUrl(): string {
    if (!this.user?.imagen) return '';
    return this.user.imagen;
  }

  redirectToUpdateBio() {
    if (this.user.blockStatus?.isBlocked) return;
    this.router.navigate(['/update-bio-user']);
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}