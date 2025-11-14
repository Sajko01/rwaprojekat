import { OrderDto } from 'src/order/order.dto';
import { ProductDto } from 'src/product/product.dto';
import { ServiceDto } from 'src/service/service.dto';

export class OrderItemDto {
    id: number;
    order: OrderDto;
    product?: ProductDto;
    service?:ServiceDto;
    quantity:number;
    addInfo:string;

}

