import { CartState } from "./carts.state";
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectCartState = createFeatureSelector<CartState>('cart');


export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.cartItems
);



export const selectIsCartEmpty = createSelector(
  selectCartState,
  (state: CartState) => state.isEmpty
);

