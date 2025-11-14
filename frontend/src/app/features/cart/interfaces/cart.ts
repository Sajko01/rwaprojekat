import { Product } from "../../products/interfaces/product";
import { Service } from "../../services/interfaces/service";
import { User } from "../../user/interfaces/user";

export interface Cart {
  id: number;
  user: User;
  location: string;

 
}

export interface CartItem {
    id: number;
    product?: Product;
    service?: Service;
    quantity: number;
    newQuantity?:number;
    tempQuantity:number;
  }
  
  export interface CreateCartDto {
    userEmail: string;
    location: string;
  }

  export interface CreateCartItemDto {
    
    cartId: number;
    productId?: number;
    serviceId?:number;
    quantity:number;
    addInfo?:string;
}

export interface CartItemDto {
    id: number;
    cart: Cart;
    product?: Product;
    service?:Service;
    quantity:number;
    addInfo?:string;
}