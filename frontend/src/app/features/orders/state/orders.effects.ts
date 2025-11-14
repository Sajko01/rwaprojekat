import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrderService } from '../services/order.service'; 
import { loadOrders, loadOrdersSuccess, loadOrdersFailure, deleteOrder, deleteOrderSuccess, deleteOrderFailure, submitOrder, submitOrderSuccess, submitOrderFailure } from './orders.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../../cart/services/cart.service';


@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService ,
    private cartService: CartService,
  
  ) {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      mergeMap((action) => 
        this.orderService.getOrdersByUserEmail(action.userEmail).pipe( 
          map(orders => loadOrdersSuccess({ orders })),
          catchError(error => of(loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );


  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrder),
      mergeMap(action =>
        this.orderService.deleteOrderById(action.orderId).pipe(
          map(() => deleteOrderSuccess({ orderId: action.orderId })),
          catchError(error => of(deleteOrderFailure({ error })))
        )
      )
    )
  );

  deleteOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrderSuccess),
      map(action => {
        console.log(`Porudžbina sa id-jem: ${action.orderId} je uspešno obrisana!`);
        
        return { type: '[Order] Delete Success Processed' };  
      })
    )
  );

 
  deleteOrderFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrderFailure),
      map(action => {
        console.error('Greška prilikom brisanja porudžbine:', action.error);
        return { type: '[Order] Delete Failure Processed' };  
      })
    )
  );

  submitOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitOrder),
      switchMap(action => 
        this.orderService.createOrder(action.orderDto).pipe(
          switchMap(response => {
            const cartId = action.orderDto.cartId;
            return this.cartService.deleteCartItemsByCartId(cartId).pipe(
              map(() => submitOrderSuccess({ cartId })),
              catchError(error => of(submitOrderFailure({ error })))
            );
          }),
          catchError(error => of(submitOrderFailure({ error })))
        )
      )
    )
  );

  submitOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitOrderSuccess),
      map(action => {
        console.log(`Narudžbina potvrđena za korpu sa id-jem: ${action.cartId}`);
        return { type: '[Order] Success Processed' };  
      })
    )
  );


  submitOrderFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitOrderFailure),
      map(action => {
        console.error('Greška prilikom potvrđivanja porudžbine:', action.error);
        return { type: '[Order] Failure Processed' };  
      })
    )
  );



}
