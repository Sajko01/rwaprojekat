

export class CreateOrderDto {
    id: number;
    userEmail: string; 
    cartId: number;
    totalPrice:number;
    orderDate:Date;
    orderLocation:string;
    orderInfo?:string;
}

