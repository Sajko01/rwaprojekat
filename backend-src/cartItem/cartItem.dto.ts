import { CartDto } from 'src/cart/cart.dto';
import { ProductDto } from 'src/product/product.dto';
import { ServiceDto } from 'src/service/service.dto';

export class CartItemDto {
    id: number;
    cart: CartDto;
    product?: ProductDto;//da li treba samo ID  4??
    service?:ServiceDto;
    quantity:number;
    addInfo?:string;
}


