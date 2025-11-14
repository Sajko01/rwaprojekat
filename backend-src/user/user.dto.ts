import { CartDto } from 'src/cart/cart.dto';
import { OrderDto } from 'src/order/order.dto';

export class UserDto{
    id: number;
    nick?: string;
    email?: string;
    addres?:string;
    password?: string;
    //carts: CartDto[];//da li treba1
   // orders: OrderDto[];//da li treba 2 
}
