
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState, orderAdapter } from './orders.state';

export const selectOrderState = createFeatureSelector<OrderState>('orders');


const { selectAll, selectEntities } = orderAdapter.getSelectors();

export const selectAllOrders = createSelector(
  selectOrderState,
  selectAll
);

export const selectOrderEntities = createSelector(
  selectOrderState,
  selectEntities
);

export const selectLoading = createSelector(
  selectOrderState,
  (state: OrderState) => state.loading
);

export const selectError = createSelector(
  selectOrderState,
  (state: OrderState) => state.error
);

