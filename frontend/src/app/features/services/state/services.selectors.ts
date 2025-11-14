
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { serviceAdapter, ServiceState } from './services.state';

export const selectServiceState = createFeatureSelector<ServiceState>('serviceState');

export const { selectAll: selectAllServices, selectEntities: selectServiceEntities } = serviceAdapter.getSelectors(selectServiceState);

export const selectLoading = createSelector(
  selectServiceState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectServiceState,
  (state) => state.error
);

export const selectServiceError = createSelector(
  selectServiceState,
  (state: ServiceState) => state.error
);

export const selectServicesInCart = createSelector(
  selectServiceState,
  (state: ServiceState) => state.servicesInCart
);
