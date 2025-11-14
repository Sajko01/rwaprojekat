import { createReducer, on } from '@ngrx/store';
import { loadCartItemsSuccess, loadCartItemsFailure, deleteCartItemSuccess, deleteCartItemFailure, deleteCartItemByServiceFailure, deleteCartItemByServiceSuccess, updateCartItemQuantity, updateCartItemQuantitySuccess, updateCartItemQuantityFailure, checkIfCartIsEmptySuccess, checkIfCartIsEmptyFailure, setCartEmpty, clearCart } from './carts.actions';
import { CartItem } from '../interfaces/cart';
import { initialState } from './carts.state';


export const cartReducer = createReducer(
  initialState,
  on(loadCartItemsSuccess, (state, { items }) => {

    const isEmpty = items.length === 0;

    return {
      ...state,
      cartItems: items,
      isEmpty: isEmpty, 
      error: null
    };
  }),
  on(loadCartItemsFailure, (state, { error }) => ({
    ...state,
    error
  })),
  
  on(deleteCartItemSuccess, (state, { productId }) => {
    const updatedCartItems = state.cartItems.filter(item => item.product?.id !== productId);
    return {
      ...state,
      cartItems: updatedCartItems,
      isEmpty: updatedCartItems.length === 0,
      error: null
    };
  }),
  on(deleteCartItemFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(deleteCartItemByServiceSuccess, (state, { serviceId }) => {
    const updatedCartItems = state.cartItems.filter(item => item.service?.id !== serviceId);
    return {
      ...state,
      cartItems: updatedCartItems,
      isEmpty: updatedCartItems.length === 0, 
      loading: false,
      error: null
    };
  }),
  

  on(deleteCartItemByServiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),


  on(updateCartItemQuantity, (state) => ({
    ...state,
    loading: true,
    error: null
  })),


  on(updateCartItemQuantitySuccess, (state, { updatedItem }) => ({
    ...state,
    cartItems: state.cartItems.map(item =>
      item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
    ),
    loading: false
  })),


  on(updateCartItemQuantityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),

  on(checkIfCartIsEmptySuccess, (state, { isEmpty }) => ({
    ...state,
    isEmpty,
    error: null
  })),

  on(checkIfCartIsEmptyFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(setCartEmpty, (state) => ({
    ...state,
    isEmpty:true, 
    
  })),
  on(clearCart, (state, { cartId }) => {

    return {
      ...state,
      isEmpty:true,
      cartItems: [], 
    };
  }),
);








