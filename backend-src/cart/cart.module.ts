import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { User } from '../user/user.entity';
import { CartItem } from '../cartItem/cartItem.entity';
import { Order } from 'src/order/order.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Cart, User,CartItem,Order])],
  providers: [CartService],
  controllers: [CartController],
})export class CartModule {}