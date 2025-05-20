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
  title = 'Stripe Angular Frontend';

  products = [
    { name: 'Smartphone', price: 15000, currency: 'usd', image: '/assets/smartphone.jpg' },
    { name: 'Headphones', price: 5000, currency: 'usd', image: '/assets/headphones.jpg' },
    { name: 'Laptop', price: 75000, currency: 'usd', image: '/assets/laptop.jpg' }
  ];

  selectedProduct = this.products[0];
  quantity = 1;
  loading = false;
  error: string | null = null;

  constructor(private paymentService: PaymentService) {}

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.quantity = 1;
    this.error = null;
  }

  async checkout() {
    this.loading = true;
    this.error = null;
    try {
      const response: any = await this.paymentService.checkout({
        name: this.selectedProduct.name,
        amount: this.selectedProduct.price,
        quantity: this.quantity,
        currency: this.selectedProduct.currency
      }).toPromise();
      window.location.href = response.sessionUrl;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erreur lors du paiement';
    } finally {
      this.loading = false;
    }
  }
}
