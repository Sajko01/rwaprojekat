import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/order.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([User,Cart,Order]), 
  forwardRef(() =>AuthModule), 
],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})export class UserModule {}