
import { createReducer, on } from '@ngrx/store';
import { orderAdapter, initialState } from './orders.state';
import { loadOrders, loadOrdersSuccess, loadOrdersFailure, deleteOrderSuccess, submitOrderSuccess, submitOrderFailure } from './orders.actions';

export const orderReducer = createReducer(
  initialState,
  on(loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadOrdersSuccess, (state, { orders }) => 
    orderAdapter.setAll(orders, {
      ...state,
      loading: false,
    })
  ),
  on(loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteOrderSuccess, (state, { orderId }) => 
    orderAdapter.removeOne(orderId, state)
  ),
  on(submitOrderSuccess, (state, { cartId }) => ({
    ...state,
    orderMade: true,
  })),
  on(submitOrderFailure, (state, { error }) => ({
    ...state,
    orderMade: false,
    error,
  }))
);

