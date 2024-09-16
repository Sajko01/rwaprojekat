import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './order.dtoc';
import { Observable, from } from 'rxjs';
@Injectable()export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto): Observable<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return from(this.orderRepository.save(order));
  }

  getAllOrders(): Observable<Order[]> {
    return from(this.orderRepository.find());
  }

  getOrder(id: number): Observable<Order> {
    return from(this.orderRepository.findOne({ where: { id: id } }));
  }

  updateOrder(id: number, order: Order): Observable<UpdateResult> {
    return from(this.orderRepository.update(id, order));
  }

  deleteOrder(id: number): Observable<DeleteResult> {
    return from(this.orderRepository.delete(id));
  }
}