import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderItem } from './orderItem.entity';
import { OrderItemService } from './orderItem.service';
import { CreateOrderItemDto } from './orderItem.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
@Controller('order-item')export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Post()
  create(@Body() orderItem: CreateOrderItemDto): Observable<OrderItem> {
    return this.orderItemService.create(orderItem);
  }

  @Get()
  getAll(): Observable<OrderItem[]> {
    return this.orderItemService.getAllOrderItems();
  }

  @Get(':id')
  getOrderItem(@Param('id') id: number): Observable<OrderItem> {
    return this.orderItemService.getOrderItem(id);
  }

  @Put(':id')
  updateOrderItem(
    @Param('id') id: number,
    @Body() orderItem: OrderItem,
  ): Observable<UpdateResult> {
    return this.orderItemService.updateOrderItem(id, orderItem);
  }

  @Delete(':id')
  deleteOrderItem(@Param('id') id: number): Observable<DeleteResult> {
    return this.orderItemService.deleteOrderItem(id);
  }
}