import { Component } from '@angular/core';
import { CartComponent } from './components/cart/cart.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCartVisible: boolean = false;

  constructor(private dialog: MatDialog) {}

  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }
  
}