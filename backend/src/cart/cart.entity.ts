import { Column, Entity, OneToMany,ManyToOne ,PrimaryGeneratedColumn, PrimaryColumnCannotBeNullableError } from "typeorm";
import { CartItem } from 'src/cartitem/cartItem.entity';
import { User } from 'src/user/user.entity';
import { Order } from "src/order/order.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location: string;
    
    @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE', eager: true })
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    cartItems: CartItem[];

    @OneToMany(() => Order, (order) => order.cart, { cascade: true })
    orders: Order[];


}




