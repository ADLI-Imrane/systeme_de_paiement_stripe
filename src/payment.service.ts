// payment.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  checkout(product: any) {
    return this.http.post('http://localhost:8080/product/v1/checkout', product);
  }
}