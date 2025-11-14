import { Module } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { OrderItemController } from './orderItem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './orderItem.entity';
import { Order } from '../order/order.entity';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';
@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order,Product,Service])],
  providers: [OrderItemService],
  controllers: [OrderItemController],
})export class OrderItemModule {}