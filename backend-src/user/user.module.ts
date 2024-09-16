import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/order.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User,Cart,Order])],
  providers: [UserService],
  controllers: [UserController],
})export class UserModule {}