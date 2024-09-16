import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { CreateCartItemDto } from './cartItem.dtoc';
import { Observable, from } from 'rxjs';
@Injectable()export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  create(createCartItemDto: CreateCartItemDto): Observable<CartItem> {
    const cartItem = this.cartItemRepository.create(createCartItemDto);
    return from(this.cartItemRepository.save(cartItem));
  }

  getAllCartItems(): Observable<CartItem[]> {
    return from(this.cartItemRepository.find());
  }

  getCartItem(id: number): Observable<CartItem> {
    return from(this.cartItemRepository.findOne({ where: { id: id } }));
  }

  updateCartItem(id: number, cartItem: CartItem): Observable<UpdateResult> {
    return from(this.cartItemRepository.update(id, cartItem));
  }

  deleteCartItem(id: number): Observable<DeleteResult> {
    return from(this.cartItemRepository.delete(id));
  }
}