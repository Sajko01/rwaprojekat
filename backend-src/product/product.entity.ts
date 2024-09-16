import { CartItem } from "src/cartitem/cartItem.entity";
import { OrderItem } from "src/orderitem/orderitem.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    image: string;

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column('decimal')
    price: number;

    @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems: CartItem[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

   
}

