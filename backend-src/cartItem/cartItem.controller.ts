import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CartItem } from './cartItem.entity';
import { CartItemService } from './cartItem.service';
import { CreateCartItemDto } from './cartItem.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('cart-item')export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  @Post()
  create(@Body() cartItem: CreateCartItemDto): Observable<CartItem> {
    return this.cartItemService.create(cartItem);
  }

  @Get()
  getAll(): Observable<CartItem[]> {
    return this.cartItemService.getAllCartItems();
  }

  @Get(':id')
  getCartItem(@Param('id') id: number): Observable<CartItem> {
    return this.cartItemService.getCartItem(id);
  }

  @Put(':id')
  updateCartItem(
    @Param('id') id: number,
    @Body() cartItem: CartItem,
  ): Observable<UpdateResult> {
    return this.cartItemService.updateCartItem(id, cartItem);
  }

  @Delete(':id')
  deleteCartItem(@Param('id') id: number): Observable<DeleteResult> {
    return this.cartItemService.deleteCartItem(id);
  }
}