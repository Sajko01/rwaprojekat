import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from '../services/cart.service';
import { loadCartItems, loadCartItemsSuccess, loadCartItemsFailure, deleteCartItem, deleteCartItemSuccess, deleteCartItemFailure, deleteCartItemByService, deleteCartItemByServiceSuccess, deleteCartItemByServiceFailure, updateCartItemQuantity, updateCartItemQuantitySuccess, updateCartItemQuantityFailure, checkIfCartIsEmpty, checkIfCartIsEmptySuccess, checkIfCartIsEmptyFailure } from './carts.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: CartService
  ) {}

  loadCartItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCartItems),
      mergeMap(action =>
        this.cartService.getCartItems(action.cartId).pipe(
          map(items => {
            const updatedItems = items.map(item => ({
              ...item,
              tempQuantity: item.quantity
            }));
    
            return loadCartItemsSuccess({ items: updatedItems });
          }),
          
          catchError(error => of(loadCartItemsFailure({ error })))
        )
      )
    )
  );

  deleteCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCartItem),
      mergeMap(action =>
        this.cartService.deleteCartItemsByCartAndProductId(action.cartId, action.productId).pipe(
          map(() => deleteCartItemSuccess({ productId: action.productId })),
          tap(() => {
            console.log('Uspešno obrisan proizvod sa id-jem:', action.productId);
          }),
          catchError((error) => {
            console.error('Greška prilikom brisanja:', error);
            return of(deleteCartItemFailure({ error }));
          })
        )
      )
    )
  );

  deleteCartItemByService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCartItemByService),
      mergeMap(action =>
        this.cartService.deleteCartItemsByCartAndServiceId(action.cartId, action.serviceId).pipe(
          map(() => deleteCartItemByServiceSuccess({ serviceId: action.serviceId })),
          tap(() => {
            console.log('Uspešno obrisana usluga sa id-jem:', action.serviceId);
          }),
          catchError((error) => {
            console.error('Greška prilikom brisanja:', error);
            return of(deleteCartItemByServiceFailure({ error }));
          })
        )
      )
    )
  );

  
  updateCartItemQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCartItemQuantity),
      mergeMap(action =>
        this.cartService.updateCartItemQuantity(action.cartItemId, action.quantity).pipe(
          map((updatedItem) => updateCartItemQuantitySuccess({ updatedItem })),
          tap((updatedItem) => {
            console.log('Količina ažurirana:', updatedItem);
          }),
          catchError((error) => {
            console.error('Greška prilikom ažuriranja količine:', error);
            return of(updateCartItemQuantityFailure({ error }));
          })
        )
      )
    )
  );


  checkIfCartIsEmpty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkIfCartIsEmpty),
      switchMap(({ email }) => {
        if (email) {
          return this.cartService.getCartForUser(email).pipe(
            switchMap((cartId) => {
              if (cartId) {
                return this.cartService.isCartEmpty(cartId).pipe(
                  map(response => checkIfCartIsEmptySuccess({ isEmpty: response.isEmpty })),
                  catchError(error => of(checkIfCartIsEmptyFailure({ error })))
                );
              } else {
                return of(checkIfCartIsEmptySuccess({ isEmpty: true })); 
              }
            })
          );
        } else {
          return of(checkIfCartIsEmptySuccess({ isEmpty: true })); 
        }
      })
    )
  );
}


