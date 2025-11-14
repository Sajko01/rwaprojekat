import { Cart } from 'src/cart/cart.entity';
import { OrderItem } from 'src/orderitem/orderitem.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE', eager: true })
  user: User;

  @ManyToOne(() => Cart, (cart) => cart.orders, { onDelete: 'CASCADE' })
  cart: Cart;

  @Column('decimal')
  totalPrice: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({nullable:true})
  orderLocation: string;

  @Column({nullable:true})
  orderInfo: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}


