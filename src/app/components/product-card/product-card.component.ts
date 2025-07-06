import { Component, OnInit } from '@angular/core';
import { ObrasService } from '../../services/obras/obras.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { MatDialog } from '@angular/material/dialog';
import { CompraDialogComponent } from '../../components/compra-dialog/compra-dialog.component';
import { ComprasService } from '../../services/compras/compras.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  selectedProduct: any = null;
  products: any[] = [];
  favoritos: Set<string> = new Set();
  isAuthenticated: boolean = false;

  constructor(
    private obrasService: ObrasService,
    private favoritosService: FavoritosService,
    private comprasService: ComprasService,
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
        this.products = Object.values(data).flat().slice(0, 3);
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
        const obra = this.products.find(o => o._id === obraId);
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

  comprarObra(obra: any) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }

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