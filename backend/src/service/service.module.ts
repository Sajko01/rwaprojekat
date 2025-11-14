import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { Cart } from '../cart/cart.entity';
import { CartItem } from 'src/cartitem/cartItem.entity';
import { OrderItem } from 'src/orderitem/orderitem.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Service,CartItem,OrderItem])],
  providers: [ServiceService],
  controllers: [ServiceController],
})export class ServiceModule {}