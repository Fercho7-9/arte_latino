import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompraDialogComponent } from '../compra-dialog/compra-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  @Input() isVisible: boolean = false;
  cartItems: any[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private dialog: MatDialog,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.authState$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      // Filtrar solo las obras disponibles
      this.cartItems = items.filter(item => item.estado !== 'Comprado');
    });
  }

  addToCart(obra: any) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }

    if (obra.estado !== 'Comprado') {
      this.cartService.addItem(obra);
    }
  }

  removeFromCart(obra: any) {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }
    this.cartService.removeItem(obra);
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.precio, 0);
  }

  async buyAll() {
    if (!this.isAuthenticated) {
      this.showAuthDialog();
      return;
    }

    if (this.cartItems.length > 0) {
      const dialogRef = this.dialog.open(CompraDialogComponent, {
        width: '500px',
        data: {
          obras: this.cartItems,
          precio: this.getTotal()
        }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (result?.success) {
        // Marcar todas las obras como compradas
        this.cartItems.forEach(item => {
          item.estado = 'Comprado';
        });
        this.cartService.clearCart();
        this.isVisible = false;
      }
    }
  }

  ingresar() {
    this.isVisible = false;
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

  goToLogin() {
    this.router.navigate(['/login']);
    this.isVisible = false;
  }

  goToRegister() {
    this.router.navigate(['/register']);
    this.isVisible = false;
  }
}