import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDto, OrderDto } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/order'; 

  constructor(private http: HttpClient) { }

  createOrder(order: CreateOrderDto): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}`, order,{headers});
  }

  getCartTotal(cartId: number): Observable<number> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${this.apiUrl}/cart-total/${cartId}`, { headers });
  }

  getOrdersByUserEmail(userEmail: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/user-order-items/${userEmail}`);
  }

  deleteOrderById(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }

 
  getAllOrdersForAdmin(): Observable<OrderDto[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<OrderDto[]>(`${this.apiUrl}/all-orders`, { headers });
  }
  
  
  
}