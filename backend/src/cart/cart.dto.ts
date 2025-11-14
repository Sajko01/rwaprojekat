import { CartItemDto } from 'src/cartitem/cartitem.dto';
import { UserDto } from 'src/user/user.dto';

export class CartDto {
    id: number;
    user: UserDto;
    location: string;
}




