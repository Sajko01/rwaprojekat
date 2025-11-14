import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './cart.dtoc';
import { Observable, from } from 'rxjs';


@Injectable()export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  create(createCartDto: CreateCartDto): Observable<Cart> {
    const cart = this.cartRepository.create(createCartDto);
    return from(this.cartRepository.save(cart));
  }

  getAllCarts(): Observable<Cart[]> {
    return from(this.cartRepository.find());
  }

  getCart(id: number): Observable<Cart> {
    return from(this.cartRepository.findOne({ where: { id: id } }));
  }

  updateCart(id: number, cart: Cart): Observable<UpdateResult> {
    return from(this.cartRepository.update(id, cart));
  }

  deleteCart(id: number): Observable<DeleteResult> {
    return from(this.cartRepository.delete(id));
  }
}