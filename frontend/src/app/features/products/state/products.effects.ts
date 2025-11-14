// product.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import {  map, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  updateProductQuantity,
  updateProductQuantitySuccess,
  updateProductQuantityFailure,
  updateProductPrice,
  updateProductPriceSuccess,
  updateProductPriceFailure,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailure,
  createProductFailure,
  createProductSuccess,
  createProduct,
  addProductToCart,
  addProductToCartSuccess,
  addProductToCartFailure,
  deleteProductFromCartSuccess,
  deleteProductFromCartFailure,
  deleteProductFromCart,
} from './products.actions';
import { Product } from '../interfaces/product';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class ProductEffects {
  constructor(private actions$: Actions
    , private http: HttpClient
    ,   private productService: ProductService
    ,   private cartService: CartService
  ) {}



  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(() =>
        this.productService.getProducts().pipe(
          map((products) =>
            
            loadProductsSuccess({ products: products.map(product => ({
              ...product,
              quantityToAdd: 1,  
              newPrice: 1,
            })) })
          ),
          catchError((error) => of(loadProductsFailure({ error: error.message })))
        )
      )
    )
  );


  updateProductQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductQuantity),
      mergeMap(({ productId, quantity }) =>
        this.productService.updateProductQuantity(productId, quantity).pipe(
          map(() => updateProductQuantitySuccess({ productId, quantity })),
          catchError((error) => of(updateProductQuantityFailure({ error })))
        )
      )
    )
  );

  
  updateProductQuantitySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductQuantitySuccess),
      map(({ productId, quantity }) => {
        console.log(`Količina proizvoda sa id-jem: ${productId} je ažurirana na ${quantity}.`);
        return { type: '[Product] Update Quantity Success Processed' };  
      })
    )
  );

 
  updateProductQuantityFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductQuantityFailure),
      map(({ error }) => {
        console.error('Greška prilikom ažuriranja količine proizvoda:', error);
        return { type: '[Product] Update Quantity Failure Processed' };  
      })
    )
  );

  updatePrice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductPrice),
      mergeMap(({ productId, newPrice }) =>
        this.productService.updateProductPrice(productId, newPrice).pipe(
          map(() => updateProductPriceSuccess({ productId, newPrice })),
          catchError((error) => of(updateProductPriceFailure({ error: error.message })))
        )
      )
    )
  );

  updateProductPriceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductPriceSuccess),
      map(({ productId, newPrice }) => {
        console.log(`Cena proizvoda sa id-jem: ${productId} je ažurirana na ${newPrice}.`);
        return { type: '[Product] Update Price Success Processed' }; 
      })
    )
  );

  
  updateProductPriceFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductPriceFailure),
      map(({ error }) => {
        console.error('Greška prilikom ažuriranja cene proizvoda:', error);
        return { type: '[Product] Update Price Failure Processed' };  
      })
    )
  );


  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProduct),
      mergeMap(action =>
        this.productService.deleteProduct(action.id).pipe(
          map(() =>deleteProductSuccess({ id: action.id })),
          catchError(error => of(deleteProductFailure({ error })))
        )
      )
    )
  );


  deleteProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductSuccess),
      map(action => {
        console.log(`Proizvod sa id-jem: ${action.id} je uspešno obrisan!`);
        return { type: '[Product] Delete Success Processed' };  
      })
    )
  );

  deleteProductFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductFailure),
      map(action => {
        console.error('Greška prilikom brisanja proizvoda:', action.error);
        
        return { type: '[Product] Delete Failure Processed' };  
      })
    )
  );


  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProduct),
      mergeMap(action =>
        this.productService.createProduct(action.product, action.image).pipe(
          map(product => createProductSuccess({ product })),
          catchError(error => of(createProductFailure({ error })))
        )
      )
    )
  );

  createProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProductSuccess),
      map(action => {
        console.log('Proizvod uspešno kreiran:', action.product);
      
        return { type: '[Product] Create Success Processed' };  
      })
    )
  );


  createProductFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProductFailure),
      map(action => {
        console.error('Greška prilikom kreiranja proizvoda:', action.error);
        return { type: '[Product] Create Failure Processed' }; 
      })
    )
  );






  addProductToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCart),
      mergeMap((action) =>
        this.cartService.createCartItem(action.cartItem).pipe(
          map((cartItem) => addProductToCartSuccess({ cartItem })),
          catchError((error) => of(addProductToCartFailure({ error })))
        )
      )
    )
  );

  addProductToCartSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCartSuccess),
      tap((action) => console.log('Proizvod je uspešno dodat u korpu:',action.cartItem))
    ),
    { dispatch: false }
  );
  
  addProductToCartFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCartFailure),
      tap((action) => console.error('Dodavanje proizvoda u korpu nije uspelo!',action.error))
    ),
    { dispatch: false }
  );



  deleteProductFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductFromCart),
      mergeMap(action =>
        this.cartService.deleteCartItemsByCartAndProductId(action.cartId, action.productId).pipe(
          map(() => deleteProductFromCartSuccess({ productId: action.productId })),
          catchError(error => of(deleteProductFromCartFailure({ error })))
        )
      )
    )
  );

  deleteProductFromCartSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductFromCartSuccess),
      tap((action) => console.log('Proizvod obrisan:',action.productId))
    ),
    { dispatch: false }
  );
  
  deleteProductFromCartFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProductFromCartFailure),
      tap((action) => console.error('Brisanje proizvoda iz korpe nije uspelo:',action.error))
    ),
    { dispatch: false }
  );
}
