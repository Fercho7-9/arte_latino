import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ObrasService } from '../../services/obras/obras.service';
import { ComprasService } from '../../services/compras/compras.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { CompraDialogComponent } from '../../components/compra-dialog/compra-dialog.component';


@Component({
  selector: 'app-estilos',
  templateUrl: './estilos.component.html',
  styleUrls: ['./estilos.component.css']
})
export class EstilosComponent implements OnInit {
  obrasPorCategoria: { [key: string]: any[] } = {
    'Pinturas Plásticas': [],
    'Pinturas Acrílica': [],
    'Pinturas Spray': [],
    'Pinturas Laca': []
  };
  favoritos: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private obrasService: ObrasService,
    private comprasService: ComprasService,
    private favoritosService: FavoritosService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarObras();
    this.cargarFavoritos();
    
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  cargarObras() {
    this.obrasService.obtenerTodasLasObras().subscribe({
      next: (obras) => {
        this.obrasPorCategoria = obras;
      },
      error: (error) => {
        console.error('Error al cargar las obras:', error);
      }
    });
  }

  cargarFavoritos() {
    this.favoritosService.obtenerMisFavoritos().subscribe({
      next: (favoritos) => {
        this.favoritos = new Set(favoritos.map((f: any) => f.obra_id._id));
      },
      error: (error) => console.error('Error al cargar favoritos:', error)
    });
  }

  comprarObra(obra: any) {
    const dialogRef = this.dialog.open(CompraDialogComponent, {
      width: '500px',
      data: { precio: obra.precio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comprasService.realizarCompra(obra._id, {
          tipo: 'tarjeta',
          numero_tarjeta: result.numero_tarjeta,
          nombre_titular: result.nombre_titular
        }).subscribe({
          next: () => {
            obra.estado = 'Comprado';
            alert('¡Compra realizada con éxito!');
          },
          error: (error) => {
            console.error('Error en la compra:', error);
            alert('Error al realizar la compra');
          }
        });
      }
    });
  }

  toggleFavorito(obra: any) {
    this.favoritosService.toggleFavorito(obra._id).subscribe({
      next: (response) => {
        if (response.favorito) {
          this.favoritos.add(obra._id);
        } else {
          this.favoritos.delete(obra._id);
        }
      },
      error: (error) => console.error('Error al gestionar favorito:', error)
    });
  }

  isFavorito(obraId: string): boolean {
    return this.favoritos.has(obraId);
  }
  quitarTildes(texto: string): string {
    return texto
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u');
  }
}