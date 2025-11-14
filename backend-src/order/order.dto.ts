import { CartDto } from 'src/cart/cart.dto';
import { OrderItemDto } from 'src/orderitem/orderitem.dto';
import { UserDto } from 'src/user/user.dto';

export class OrderDto {
    id: number;
    user: UserDto; // da li treba 6 i 7 ili number?
    cart: CartDto;
    totalPrice:number;
    orderDate:Date;
    //orderItems: OrderItemDto[];//da li treba 5
}

