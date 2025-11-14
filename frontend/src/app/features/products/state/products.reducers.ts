
import { createReducer, on } from '@ngrx/store';
import { loadProducts, loadProductsSuccess, loadProductsFailure, updateProductQuantitySuccess, updateProductQuantityFailure, updateProductPriceSuccess, updateProductPriceFailure, deleteProductSuccess, deleteProductFailure, createProductSuccess, createProductFailure, addProductToCartSuccess, addProductToCartFailure, deleteProductFromCartSuccess, deleteProductFromCartFailure } from './products.actions';
import { initialState, adapter } from './products.state';

export const productReducer = createReducer(
  initialState,
  
  on(loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(loadProductsSuccess, (state, { products }) =>
    adapter.setAll(products, { ...state, loading: false, error: null })
  ),
  
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(updateProductQuantitySuccess, (state, { productId, quantity }) =>
    adapter.updateOne({ id: productId, changes: { quantity } }, state)
  ),
  
  on(updateProductQuantityFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(updateProductPriceSuccess, (state, { productId, newPrice }) =>
    adapter.updateOne({ id: productId, changes: { price: newPrice } }, state)
  ),
  
  on(updateProductPriceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(deleteProductSuccess, (state, { id }) =>
    adapter.removeOne(id, state)
  ),
  
  on(deleteProductFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(createProductSuccess, (state, { product }) =>
    adapter.addOne(product, state)
  ),
  
  on(createProductFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(addProductToCartSuccess, (state, { cartItem }) => ({
    ...state,
    productsInCart: [...state.productsInCart, cartItem],
    error: null,
  })),
  
  on(addProductToCartFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(deleteProductFromCartSuccess, (state, { productId }) => ({
    ...state,
    productsInCart: state.productsInCart.filter(item => item.id !== productId),
  })),
  
  on(deleteProductFromCartFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
