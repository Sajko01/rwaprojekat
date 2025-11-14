export interface AuthState {
    isLoggedIn: boolean;
    nick?: string; 
    role?:string;
    token?: string;
    cartId?:number
  }
  
  export const initialState: AuthState = {
    isLoggedIn: false,
    role: undefined,
    token: undefined,
    cartId:undefined
  };