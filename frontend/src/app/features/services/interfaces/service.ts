export interface Service {
    id: number;
    name: string;
    image: string;
    pricePerUnit:number;
    description:string;
    quantityToAdd?: number; 
    newPrice?: number; 

}

