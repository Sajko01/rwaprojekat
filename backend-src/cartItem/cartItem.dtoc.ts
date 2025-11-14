
export class CreateCartItemDto {
    id: number;
    cartId: number;
    productId?: number;
    serviceId?:number;
    quantity:number;
    addInfo?:string;
}

