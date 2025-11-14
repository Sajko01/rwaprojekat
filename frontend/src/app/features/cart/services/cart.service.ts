import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateCartDto } from '../../user/interfaces/auth';
import { Cart, CartItem, CreateCartItemDto } from '../interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private apiUrlItems = 'http://localhost:3000/cart-item';

  constructor(private http: HttpClient) {}


  getCartItems(cartId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrlItems}/${cartId}`);
  }

  updateCartItemQuantity(id: number, quantity: number): Observable<CartItem> {
    const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<CartItem>(`${this.apiUrlItems}/${id}/quantity`, { quantity },{headers});
  }

  createCartItem(cartItem: CreateCartItemDto): Observable<CartItem> {
    const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<CartItem>(`${this.apiUrlItems}`, cartItem,{headers});
  }

  deleteCartItemsByCartAndProductId(cartId: number, productId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrlItems}/delete-by-cart-product/${cartId}/${productId}`;
    return this.http.delete(url,{headers}); 
  }

  deleteCartItemsByCartAndServiceId(cartId: number, serviceId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrlItems}/delete-by-cart-service/${cartId}/${serviceId}`;
    return this.http.delete(url,{headers}); 
  }

  deleteCartItemsByCartId(cartId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrlItems}/delete-by-cart/${cartId}`;
    return this.http.delete(url,{headers});
  }

  getCartLocationByEmail(email: string): Observable<{ location: string }> {
    return this.http.get<{ location: string }>(`${this.apiUrl}/location/${email}`);
  }

  isProductInCart(cartId: number, productId: number): Observable<boolean> {
    const url = `${this.apiUrlItems}/is-in-cart/${cartId}/${productId}`;
    return this.http.get<boolean>(url);
  }//umesto

  //DODAJEEM
  getProductsInCart(cartId: number): Observable<{ id: number; name: string; quantity: number }[]> {
  const url = `${this.apiUrlItems}/products-in-cart/${cartId}`;
  return this.http.get<{ id: number; name: string; quantity: number }[]>(url);
}

  isServiceInCart(cartId: number, serviceId: number): Observable<boolean> {
    const url = `${this.apiUrlItems}/is-in-cart-s/${cartId}/${serviceId}`;
    return this.http.get<boolean>(url);
  }

  isCartEmpty(cartId: number): Observable<{ isEmpty: boolean }> {
    return this.http.get<{ isEmpty: boolean }>(`${this.apiUrlItems}/${cartId}/is-empty`);
  }

 
  create(createCartDto: CreateCartDto): Observable<any> {
    return this.http.post<Cart>(`${this.apiUrl}`, createCartDto);
  }

 

  updateCartLocation(cartId: number, newLocation: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${cartId}/location`, { location: newLocation });
  }


 
  getCartForUser(email: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${email}/`).pipe(
      map((cartId: number) => cartId), 
      catchError((error) => {
        console.error('Greška prilikom dohvatanja ID-a korpe:', error);
        return throwError(() => new Error('Nema dostupne korpe za ovog korisnika!'));
      })
    );
  }

  getCartLocationById(cartId: number): Observable<{ location: string }> {
    return this.http.get<{ location: string }>(`${this.apiUrl}/location/cart/${cartId}`);
  }
  


}
