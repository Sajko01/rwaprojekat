import { CartItem } from "src/cartitem/cartItem.entity";
import { OrderItem } from "src/orderitem/orderitem.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['name'])
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column({ type: 'decimal' })
    pricePerUnit: number;

    @Column()
    description: string;

    @OneToMany(() => CartItem, (cartItem) => cartItem.service)
    cartItems: CartItem[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.service)
    orderItems: OrderItem[];



    }