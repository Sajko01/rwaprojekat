import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../user/user.entity';
import { CartItem } from 'src/cartitem/cartItem.entity';
import { OrderItem } from 'src/orderitem/orderitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,CartItem,OrderItem])], 
  providers: [ProductService],
  controllers: [ProductController],
})export class ProductModule {}

