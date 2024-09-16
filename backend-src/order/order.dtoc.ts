

export class CreateOrderDto {
    id: number;
    userId: number; 
    cartId: number;
    totalPrice:number;
    orderDate:Date;
}

