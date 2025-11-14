import { Cart } from "../../cart/interfaces/cart";
import { Product } from "../../products/interfaces/product";
import { Service } from "../../services/interfaces/service";
import { User } from "../../user/interfaces/user";

export interface CreateOrderDto {
    id: number;
    userEmail: string; 
    cartId: number;
    totalPrice:number;
    orderDate:Date;
    orderLocation?:string;
    orderInfo?:string;
}
export interface OrderWithDelete extends OrderDto {
    canDelete: boolean;
  }

export interface OrderDto {
    id: number;
    user: User; 
    cart: Cart;
    totalPrice:number;
    orderDate:Date;
    orderItems: OrderItemDto[];
    orderLocation:string;
    orderInfo?:string;

}

export interface OrderItemDto {
    
    order: OrderDto;
    product?: Product;
    service?:Service;
    quantity:number;
    addInfo?:string;
}


export interface CreateOrderItemDto {
    
    orderId: number;
    productId?: number;
    serviceId?:number;
    quantity:number;
    addInfo?:string;
}
