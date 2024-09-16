import { Module } from '@nestjs/common';
import { CartItemService } from './cartItem.service';
import { CartItemController } from './cartItem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cartItem.entity';
import { Cart } from '../cart/cart.entity';
import { Service } from 'src/service/service.entity';
import { Product } from 'src/product/product.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart,Product,Service])],
  providers: [CartItemService],
  controllers: [CartItemController],
})export class CartItemModule {}