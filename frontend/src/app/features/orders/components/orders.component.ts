import { Component, Input } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CartService } from '../../cart/services/cart.service';
import { catchError, combineLatest, interval, map, Observable, of, Subscription, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthState } from '../../../auth/auth.state';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectUserCartId, selectUserNick, selectUserRole } from '../../../auth/auth.selectors';
import { CreateOrderDto, OrderDto, OrderWithDelete } from '../interfaces/order';
import { deleteOrder, loadOrders } from '../state/orders.actions';
import { selectAllOrders } from '../state/orders.selectors';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  isLoggedIn$: Observable<boolean>;
  userNick$: Observable<string | undefined>; 
  userRole$: Observable<string | undefined>; 
  userCartId$: Observable<number | undefined>;

  constructor( private orderService: OrderService,private store: Store<AuthState>,private http: HttpClient,private cartService:CartService) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userNick$ = this.store.select(selectUserNick); 
    this.userRole$ = this.store.select(selectUserRole); 
    this.userCartId$=this.store.select(selectUserCartId);
  }
 
orders$: Observable<OrderWithDelete[]> = of([]); 
ordersAdmin$: Observable<OrderDto[]> = of([]);

OrderAdmin(){

  this.ordersAdmin$ = combineLatest([this.userRole$, this.isLoggedIn$]).pipe(
  switchMap(([role, isLoggedIn]) => {
    if (isLoggedIn && role === 'admin') {
      return this.orderService.getAllOrdersForAdmin().pipe(
        catchError((error) => {
          console.error('Greška prilikom dohvatanja narudžbina:', error);
          return of([]);
        })
      );
    }
    return of([]);
  })
);


}


ngOnInit() {

 this.loadOrders();
    this.OrderAdmin(); 



}


ngOnDestroy(): void {


}


loadOrders(): void {
  this.userNick$.pipe(
    take(1), 
    switchMap((email) => {
      if (email) {
        this.store.dispatch(loadOrders({ userEmail: email })); 
        return of([]); 
      } else {
        console.error('Email nije nadjen!');
        return of([]); 
      }
    })
  ).subscribe();

  this.orders$ = this.store.select(selectAllOrders).pipe(
    map(orders => 
      orders.map(order => ({
        ...order,
        canDelete: this.canDeleteOrder(order.orderDate)
      }))
    )
  );
}


canDeleteOrder(orderDate: Date): boolean {
  const now = new Date();
  const fiveMinutes =5 * 60 * 1000; 
  const orderTime = new Date(orderDate).getTime();
  return now.getTime() - orderTime <= fiveMinutes;
}


deleteOrder(orderId: number): void {
  this.store.dispatch(deleteOrder({ orderId }));
}



  getImageUrl(imagePath: string): string {
    return `http://localhost:3000/img/${imagePath}`;
  }

}
