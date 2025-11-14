// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, { nick,role,token ,cartId}) => {
    localStorage.setItem('authToken', token); 
    return { ...state, isLoggedIn: true, nick, role, token,cartId };
  }),
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('authToken'); 
    return { ...state, isLoggedIn: false, nick: '', role: undefined, token: undefined ,cartId:undefined};
  })
   
);
