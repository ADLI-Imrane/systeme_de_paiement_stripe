import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WRX - SHOP';

  products = [
    { name: 'Smartphone', price: 15000, currency: 'usd', image: '/assets/smartphone.webp' },
    { name: 'Headphones', price: 5000, currency: 'usd', image: '/assets/headphones.jpg' },
    { name: 'Laptop', price: 75000, currency: 'usd', image: '/assets/laptop.jpg' },
    { name: 'Smartwatch', price: 12000, currency: 'usd', image: '/assets/smartwatch.webp' },
    { name: 'Tablet', price: 30000, currency: 'usd', image: '/assets/tablet.webp' },
    { name: 'Bluetooth Speaker', price: 4000, currency: 'usd', image: '/assets/speaker.webp' },
    { name: 'Camera', price: 35000, currency: 'usd', image: '/assets/camera.webp' },
    { name: 'Wireless Mouse', price: 2000, currency: 'usd', image: '/assets/mouse.webp' }
  ];

  cart: any[] = [];
  loading = false;
  error: string | null = null;
  showCart = false;

  constructor(private paymentService: PaymentService) {}

  addToCart(product: any) {
    const found = this.cart.find((item) => item.name === product.name);
    if (found) {
      found.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.error = null;
    this.showCart = true;
  }

  removeFromCart(product: any) {
    this.cart = this.cart.filter((item) => item.name !== product.name);
  }

  updateQuantity(product: any, delta: number) {
    const found = this.cart.find((item) => item.name === product.name);
    if (found) {
      found.quantity = Math.max(1, found.quantity + delta);
    }
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  async checkout() {
    if (this.cart.length === 0) return;
    this.loading = true;
    this.error = null;
    try {
      const response: any = await this.paymentService.checkout({
        products: this.cart.map(item => ({
          name: item.name,
          amount: item.price,
          quantity: item.quantity,
          currency: item.currency
        }))
      }).toPromise();
      window.location.href = response.sessionUrl;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erreur lors du paiement';
    } finally {
      this.loading = false;
    }
  }

  openCart() {
    this.showCart = true;
  }

  closeCart() {
    this.showCart = false;
  }
}
