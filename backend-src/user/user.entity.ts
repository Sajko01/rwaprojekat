import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/order.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nick: string;

    @Column({ unique: true })
    email: string;

    @Column()
    addres: string;

    @Column()
    password: string;
    
    @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
    carts: Cart[];

    @OneToMany(() => Order, (order) => order.user, { cascade: true })
    orders: Order[];
  
}

