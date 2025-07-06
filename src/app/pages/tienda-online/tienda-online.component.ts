import { Component, OnInit, ViewChild } from '@angular/core';
import { ObrasService } from '../../services/obras/obras.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { MatDialog } from '@angular/material/dialog';
import { CompraDialogComponent } from '../../components/compra-dialog/compra-dialog.component';
import { ComprasService } from '../../services/compras/compras.service';
import { CartComponent } from '../../components/cart/cart.component';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tienda-online',
  templateUrl: './tienda-online.component.html',
  styleUrls: ['./tienda-online.component.css']
})
export class TiendaOnlineComponent implements OnInit {
  obras: any[] = [];
  favoritos: Set<string> = new Set();
  cartVisible: boolean = false;
  isAuthenticated: boolean = false;
  @ViewChild(CartComponent) cartComponent!: CartComponent;

  constructor(
    private obrasService: ObrasService,
    private favoritosService: FavoritosService,
    private comprasService: ComprasService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.authService.authState$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
  }

  ngOnInit() {
    this.cargarObras();
    if (this.isAuthenticated) {
      this.cargarFavoritos();
    }
  }

  cargarObras() {
    this.obrasService.obtenerTodasLasObras().subscribe({
      next: (data) => {
        this.obras = Object.values(data).flat().filter((obra: any) => obra.estado !== 'Comprado');
      },
      error: (error) => console.error('Error al cargar obras:', error)
    });
  }

  cargarFavoritos() {
    if (!this.isAuthenticated) return;

    this.favoritosService.obtenerMisFavoritos().subscribe({
      next: (data) => {
        this.favoritos = new Set(data.map((fav: any) => fav.obra_id._id));
      },
      error: (error) => console.error('Error al cargar favoritos:', error)
    });
  }

  rateObra(obraId: string, rating: number) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }

    this.obrasService.rateObra(obraId, rating).subscribe({
      next: (response) => {
        const obra = this.obras.find(o => o._id === obraId);
        if (obra) {
          obra.averageRating = response.averageRating;
        }
      },
      error: (error) => console.error('Error al calificar:', error)
    });
  }

  toggleFavorito(obra: any) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
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

  agregarAlCarrito(obra: any) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }

    if (obra.estado !== 'Comprado') {
      this.cartService.addItem(obra);
      this.cartVisible = true;
    }
  }

  toggleCart() {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }
    this.cartVisible = !this.cartVisible;
  }

  comprarObra(obra: any) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }

    if (obra.estado === 'Comprado') return;

    const dialogRef = this.dialog.open(CompraDialogComponent, {
      width: '500px',
      data: { 
        obras: [obra],
        precio: obra.precio 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        obra.estado = 'Comprado';
        this.cargarObras();
        this.cartService.removeItem(obra);
      }
    });
  }

  showAuthDialog() {
    const dialogRef = this.dialog.open(CompraDialogComponent, {
      width: '500px',
      data: { requiresAuth: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'login') {
        this.router.navigate(['/login']);
      } else if (result?.action === 'register') {
        this.router.navigate(['/register']);
      }
    });
  }
}