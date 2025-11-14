// product.actions.ts
import { createAction, props } from '@ngrx/store';
import { Product } from '../interfaces/product';


export const loadProducts = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);


export const updateProductQuantity = createAction(
  '[Product] Update Product Quantity',
  props<{ productId: number, quantity: number }>()
);

export const updateProductQuantitySuccess = createAction(
  '[Product] Update Product Quantity Success',
  props<{ productId: number, quantity: number }>()
);

export const updateProductQuantityFailure = createAction(
  '[Product] Update Product Quantity Failure',
  props<{ error: string }>()
);

export const updateProductPrice = createAction(
  '[Product] Update Product Price',
  props<{ productId: number, newPrice: number }>()
);

export const updateProductPriceSuccess = createAction(
  '[Product] Update Product Price Success',
  props<{ productId: number, newPrice: number }>()
);

export const updateProductPriceFailure = createAction(
  '[Product] Update Product Price Failure',
  props<{ error: string }>()
);


export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ id: number }>()
);

export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ id: number }>()
);

export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: any }>()
);

export const createProduct = createAction(
  '[Product] Create Product',
  props<{ product: Product; image: File }>()
);

export const createProductSuccess = createAction(
  '[Product] Create Product Success',
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  '[Product] Create Product Failure',
  props<{ error: any }>()
);



export const addProductToCart = createAction(
  '[Product Page] Add Product To Cart',
  props<{ cartItem: any }>()
);

export const addProductToCartSuccess = createAction(
  '[Product Page] Add Product To Cart Success',
  props<{ cartItem: any }>()
);


export const addProductToCartFailure = createAction(
  '[Product Page] Add Product To Cart Failure',
  props<{ error: any }>()
);



export const deleteProductFromCart = createAction(
  '[Cart] Delete Product From Cart',
  props<{ cartId: number; productId: number }>() 
);
export const deleteProductFromCartSuccess = createAction(
  '[Cart] Delete Product From Cart Success',
  props<{ productId: number }>()
);
export const deleteProductFromCartFailure = createAction(
  '[Cart] Delete Product From Cart Failure',
  props<{ error: any }>()
);


export const checkProductInCart = createAction(
  '[Product] Check Product In Cart',
  props<{ productId: number; cartId: number }>()
);

export const checkProductInCartSuccess = createAction(
  '[Product] Check Product In Cart Success',
  props<{ productId: number; exists: boolean }>()
);

export const checkProductInCartFailure = createAction(
  '[Product] Check Product In Cart Failure',
  props<{ productId: number; error: any }>()
);

