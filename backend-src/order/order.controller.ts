import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Order } from './order.entity'
;import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
@Controller('order')export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Body() order: CreateOrderDto): Observable<Order> {
    return this.orderService.create(order);
  }

  @Get()
  getAll(): Observable<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  getOrder(@Param('id') id: number): Observable<Order> {
    return this.orderService.getOrder(id);
  }

  @Put(':id')
  updateOrder(
    @Param('id') id: number,
    @Body() order: Order,
  ): Observable<UpdateResult> {
    return this.orderService.updateOrder(id, order);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: number): Observable<DeleteResult> {
    return this.orderService.deleteOrder(id);
  }
}