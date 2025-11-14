
export class CreateOrderItemDto {
    id: number;
    orderId: number;
    productId?: number;
    serviceId?:number;
    quantity:number;
    addInfo:string;

}

