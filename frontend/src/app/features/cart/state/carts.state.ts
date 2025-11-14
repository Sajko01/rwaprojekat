

import { CartItem } from "../interfaces/cart";


export interface CartState {
  cartItems: CartItem[];
  isEmpty: boolean;
  error: any;

}

export const initialState: CartState = {
  cartItems: [],
  isEmpty: true,
  error: null
};


