import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'shopping_cart';
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addItem(item: any) {
    const currentItems = this.cartItemsSubject.value;
    if (!currentItems.find(i => i._id === item._id)) {
      this.saveCart([...currentItems, item]);
    }
  }

  removeItem(item: any) {
    const currentItems = this.cartItemsSubject.value;
    this.saveCart(currentItems.filter(i => i._id !== item._id));
  }

  clearCart() {
    this.saveCart([]);
  }

  getItems() {
    return this.cartItemsSubject.value;
  }
}