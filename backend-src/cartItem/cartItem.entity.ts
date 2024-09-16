import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { nullable: true, eager: true,onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Service, { nullable: true, eager: true,onDelete: 'CASCADE' })
  service: Service;


  @Column('int')
  quantity: number;

  @Column({ nullable: true })
  addInfo: string;
}
