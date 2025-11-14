import { CartDto } from 'src/cart/cart.dto';
import { OrderDto } from 'src/order/order.dto';
import { UserRole } from './user.entity';

export class UserDto{
    id: number;
    nick?: string;
    email?: string;
    address?:string;
    password?: string;
    role?:UserRole
 
}
