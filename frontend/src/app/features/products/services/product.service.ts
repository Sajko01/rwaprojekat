import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Product } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endpoint = 'http://localhost:3000/product';
  constructor(private http: HttpClient) { }

  public getProducts() {
    return this.http.get<Product[]>(this.endpoint);
    
  }

  public getProduct(id: number) {
    return this.http.get<Product>(this.endpoint, { params: { id: id } });
  }


  public postProduct(p: Product) {
    return this.http.post<boolean>(this.endpoint, p);
  }

  public putProduct(p: Product) {
    return this.http.put<boolean>(this.endpoint, p);
  }

  updateProductQuantity(id: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.endpoint}/${id}/quantity`, { quantity },{headers});
     

  }

  updateProductPrice(id: number, price: number): Observable<any> {
    const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.endpoint}/${id}/price`, { price},{headers});
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.endpoint}/${id}`, { headers });
  }

  

  createProduct(productData: Product, image: File): Observable<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('type', productData.type);
    formData.append('quantity', productData.quantity.toString());
    formData.append('price', productData.price.toString());
    formData.append('image', image);

    const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Product>(this.endpoint, formData, { headers });
  }

}
