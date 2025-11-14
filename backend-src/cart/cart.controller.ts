import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CreateCartDto } from './cart.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('cart')export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  create(@Body() cart: CreateCartDto): Observable<Cart> {
    return this.cartService.create(cart);
  }

  @Get()
  getAll(): Observable<Cart[]> {
    return this.cartService.getAllCarts();
  }

  @Get(':id')
  getCart(@Param('id') id: number): Observable<Cart> {
    return this.cartService.getCart(id);
  }

  @Put(':id')
  updateCart(
    @Param('id') id: number,
    @Body() cart: Cart,
  ): Observable<UpdateResult> {
    return this.cartService.updateCart(id, cart);
  }

  @Delete(':id')
  deleteCart(@Param('id') id: number): Observable<DeleteResult> {
    return this.cartService.deleteCart(id);
  }
}