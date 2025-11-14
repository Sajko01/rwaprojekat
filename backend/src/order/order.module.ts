import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { OrderItem } from 'src/orderitem/orderitem.entity';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, User,Cart,OrderItem,Product,Service])],
  providers: [OrderService],
  controllers: [OrderController],
})export class OrderModule {}