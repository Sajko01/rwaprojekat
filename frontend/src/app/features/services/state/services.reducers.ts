
import { createReducer, on } from '@ngrx/store';
import { createService, createServiceSuccess, createServiceFailure, deleteServiceFailure, deleteServiceSuccess, updatePriceFailure, updatePriceSuccess, updatePrice, loadServices, loadServicesSuccess, loadServicesFailure, addToCartSuccess, addToCartFailure, deleteCartItems, deleteCartItemsSuccess, deleteCartItemsFailure } from './services.actions';
import { initialState, serviceAdapter } from './services.state';

export const serviceReducer = createReducer(
  initialState,
  
  on(createService, (state) => ({
    ...state,
    error: null,
  })),
  
  on(createServiceSuccess, (state, { service }) =>
    serviceAdapter.addOne(service, state)
  ),
  
  on(createServiceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(deleteServiceSuccess, (state, { id }) =>
    serviceAdapter.removeOne(id, state)
  ),
  
  on(deleteServiceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(updatePrice, (state) => ({
    ...state,
    error: null,
  })),
  
  on(updatePriceSuccess, (state, { serviceId, newPrice }) =>
    serviceAdapter.updateOne(
      { id: serviceId, changes: { pricePerUnit: newPrice } },
      state
    )
  ),
  
  on(updatePriceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  on(loadServices, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(loadServicesSuccess, (state, { services }) =>
    serviceAdapter.setAll(services, {
      ...state,
      loading: false,
    })
  ),
  
  on(loadServicesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(addToCartSuccess, (state, { cartItem }) => ({
    ...state,
    servicesInCart: [...state.servicesInCart, cartItem],
    error: null,
  })),
  
  on(addToCartFailure, (state, { error }) => ({
    ...state,
    error: 'Greška prilikom dodavanja usluge u korpu: ' + error,
  })),
  
  on(deleteCartItems, (state) => ({
    ...state,
    error: null,
  })),
  
  on(deleteCartItemsSuccess, (state, { serviceId }) => ({
    ...state,
    servicesInCart: state.servicesInCart.filter((item) => item.id !== serviceId),
  })),
  
  on(deleteCartItemsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);

