import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ServiceService } from '../services/service.service';
import { createService, createServiceSuccess, createServiceFailure, deleteService, deleteServiceFailure, deleteServiceSuccess, updatePriceFailure, updatePriceSuccess, updatePrice, loadServices, loadServicesSuccess, loadServicesFailure, addToCart, addToCartSuccess, addToCartFailure, deleteCartItems, deleteCartItemsSuccess, deleteCartItemsFailure } from './services.actions';
import { Service } from '../interfaces/service';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class ServiceEffects {
  constructor(private actions$: Actions,
     private serviceService: ServiceService,
     private cartService: CartService,
    ) {}

  loadServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServices),
      mergeMap(() =>
        this.serviceService.getServices().pipe(
          map((services) => loadServicesSuccess({ services })),
          catchError((error) => of(loadServicesFailure({ error })))
        )
      )
    )
  );

  createService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createService),
      mergeMap(({ service, image }) =>
        this.serviceService.createService(service, image).pipe(
          map((newService: Service) => createServiceSuccess({ service: newService })),
          catchError((error) => of(createServiceFailure({ error })))
        )
      )
    )
  );

  createServiceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createServiceSuccess),
        tap(({ service }) => {
          console.log('Usluga kreirana uspešno:', service);
          
        })
      ),
    { dispatch: false } 
  );

  createServiceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createServiceFailure),
        tap(({ error }) => {
          console.error('Greška prilikom kreiranja usluge:', error);
        
        })
      ),
    { dispatch: false } 
  );


  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteService),
      mergeMap(({ id }) =>
        this.serviceService.deleteService(id).pipe(
          map(() => deleteServiceSuccess({ id })),
          catchError((error) => of(deleteServiceFailure({ error })))
        )
      )
    )
  );

  deleteServiceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteServiceSuccess),
        tap(({ id }) => {
          console.log(`Usluga sa ID ${id} uspešno obrisana!`);
         
        })
      ),
    { dispatch: false }
  );


  deleteServiceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteServiceFailure),
        tap(({ error }) => {
          console.error('Greška prilikom brisanja usluge:', error);
        })
      ),
    { dispatch: false }
  );


  updatePrice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePrice),
      mergeMap(({ serviceId, newPrice }) =>
        this.serviceService.updateServicePrice(serviceId, newPrice).pipe(
          map(() => updatePriceSuccess({ serviceId, newPrice })),
          catchError((error) => of(updatePriceFailure({ error })))
        )
      )
    )
  );


  updatePriceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updatePriceSuccess),
        tap(({ serviceId, newPrice }) => {
          console.log(`Cena za uslugu sa ID ${serviceId} uspešno ažurirana na ${newPrice}!`);
         
        })
      ),
    { dispatch: false }
  );

 
  updatePriceFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updatePriceFailure),
        tap(({ error }) => {
          console.error('Greška prilikom ažuriranja cene:', error);
        })
      ),
    { dispatch: false }
  );


  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      switchMap(action =>
        this.cartService.createCartItem(action.cartItem).pipe(
          map(cartItem => { return addToCartSuccess({ cartItem });
          }),
          catchError(error => {  return of(addToCartFailure({ error }));
          })
        )
      )
    )
  );

  addToCartSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCartSuccess),
      map(action => {
        console.log('Usluga dodata u korpu:', action.cartItem);
        
        return; 
      })
    ),
    { dispatch: false } 
  );

  addToCartFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCartFailure),
      map(action => {
        console.error('Dodavanje u korpu nije uspelo:', action.error);
       
        return; 
      })
    ),
    { dispatch: false } 
  );


  deleteCartItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCartItems),
      switchMap(action =>
        this.cartService.deleteCartItemsByCartAndServiceId(action.cartId, action.serviceId).pipe(
          map(response => {
           
            return deleteCartItemsSuccess({ serviceId:action.serviceId });
          }),
          catchError(error => {
        
            return of(deleteCartItemsFailure({ error }));
          })
        )
      )
    )
  );

  
}
