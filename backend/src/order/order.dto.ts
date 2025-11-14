import { CartDto } from 'src/cart/cart.dto';
import { OrderItemDto } from 'src/orderitem/orderitem.dto';
import { UserDto } from 'src/user/user.dto';

export class OrderDto {
    id: number;
    user: UserDto; 
    cart: CartDto;
    totalPrice:number;
    orderDate:Date;
    orderLocation:string;
    orderInfo?:string;

}

