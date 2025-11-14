import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { nullable: true, eager: true,onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Service, { nullable: true, eager: true,onDelete: 'CASCADE'})
  service: Service;

  @Column('int')
  quantity: number;

  @Column({ nullable: true })
  addInfo: string;
}
