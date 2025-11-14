import { OrderDto } from 'src/order/order.dto';
import { ProductDto } from 'src/product/product.dto';
import { ServiceDto } from 'src/service/service.dto';

export class OrderItemDto {
    id: number;
    order: OrderDto;
    product?: ProductDto;//8 9 i 10 da li treba number????
    service?:ServiceDto;
    quantity:number;
    addInfo:string;

}

