import { createAction, props } from '@ngrx/store';
import { CartItem } from '../interfaces/cart'; 

export const loadCartItems = createAction(
  '[Cart] Load Cart Items',
  props<{ cartId: number }>()
);

export const loadCartItemsSuccess = createAction(
  '[Cart] Load Cart Items Success',
  props<{ items: CartItem[] }>()
);

export const loadCartItemsFailure = createAction(
  '[Cart] Load Cart Items Failure',
  props<{ error: any }>()
);


export const deleteCartItem = createAction(
  '[Cart] Delete Cart Item',
  props<{ cartId: number, productId: number }>()
);

export const deleteCartItemSuccess = createAction(
  '[Cart] Delete Cart Item Success',
  props<{ productId: number }>()
);

export const deleteCartItemFailure = createAction(
  '[Cart] Delete Cart Item Failure',
  props<{ error: any }>()
);


export const deleteCartItemByService = createAction(
  '[Cart] Delete Cart Item By Service',
  props<{ cartId: number; serviceId: number }>()
);

export const deleteCartItemByServiceSuccess = createAction(
  '[Cart] Delete Cart Item By Service Success',
  props<{ serviceId: number }>()
);

export const deleteCartItemByServiceFailure = createAction(
  '[Cart] Delete Cart Item By Service Failure',
  props<{ error: any }>()
);


export const updateCartItemQuantity = createAction(
  '[Cart] Update Cart Item Quantity',
  props<{ cartItemId: number; quantity: number }>()
);

export const updateCartItemQuantitySuccess = createAction(
  '[Cart] Update Cart Item Quantity Success',
  props<{ updatedItem: any }>()
);

export const updateCartItemQuantityFailure = createAction(
  '[Cart] Update Cart Item Quantity Failure',
  props<{ error: any }>()
);


export const checkIfCartIsEmpty = createAction(
  '[Cart] Check If Cart Is Empty'
  , props<{ email: string | undefined }>()
);

export const checkIfCartIsEmptySuccess = createAction(
  '[Cart] Check If Cart Is Empty Success'
  , props<{ isEmpty: boolean }>()
);

export const checkIfCartIsEmptyFailure = createAction(
  '[Cart] Check If Cart Is Empty Failure'
  , props<{ error: any }>()
);

export const setCartEmpty = createAction(
  '[Cart] Set Cart Empty'
);


export const clearCart = createAction(
  '[Cart] Clear Cart',
  props<{ cartId: number }>()
);


