import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ nick: string;role: string ; token: string;cartId:number }>() 
);

export const logout = createAction('[Auth] Logout');