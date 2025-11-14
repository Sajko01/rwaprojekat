import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { CreateOrderItemDto } from './orderItem.dtoc';
import { Observable, from } from 'rxjs';
@Injectable()export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  create(createOrderItemDto: CreateOrderItemDto): Observable<OrderItem> {
    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    return from(this.orderItemRepository.save(orderItem));
  }

  getAllOrderItems(): Observable<OrderItem[]> {
    return from(this.orderItemRepository.find());
  }

  getOrderItem(id: number): Observable<OrderItem> {
    return from(this.orderItemRepository.findOne({ where: { id: id } }));
  }

  updateOrderItem(id: number, orderItem: OrderItem): Observable<UpdateResult> {
    return from(this.orderItemRepository.update(id, orderItem));
  }

  deleteOrderItem(id: number): Observable<DeleteResult> {
    return from(this.orderItemRepository.delete(id));
  }
}