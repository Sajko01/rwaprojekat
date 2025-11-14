
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState, adapter } from './products.state';

export const selectProductState = createFeatureSelector<ProductState>('products');

const { selectAll } = adapter.getSelectors(selectProductState);

export const selectAllProducts = selectAll;

export const selectProductsLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
);

export const selectProductsInCart = createSelector(
  selectProductState,
  (state: ProductState) => state.productsInCart
);
