import { Cart } from "../../cart/interfaces/cart";
import { Service } from "../../services/interfaces/service";

export interface Product{
    id: number;
    name: string;
    type: string;
    image: string;
    quantity: number;
    price:number;
    quantityToAdd?: number; 
    newPrice?:number
}

