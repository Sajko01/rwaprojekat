import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);

export const selectUserNick = createSelector(
  selectAuthState,
  (state: AuthState) => state.nick
);

export const selectUserRole = createSelector( 
  selectAuthState,
  (state: AuthState) => state.role
);

export const selectUserCartId= createSelector(
  selectAuthState,
  (state: AuthState) => state.cartId
);
