import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { CreateOrderItemDto } from './orderItem.dtoc';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';
import { Order } from 'src/order/order.entity';
import { CartItem } from 'src/cartitem/cartItem.entity';
@Injectable()export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>
  ) {}


  create(createOrderItemDto: CreateOrderItemDto): Observable<OrderItem> {
    const { orderId, productId, serviceId, quantity, addInfo } = createOrderItemDto;

    if (quantity <= 0) {
      return throwError(() => new Error('Količina mora biti pozitivna!'));
    }

    return from(this.orderRepository.findOne({ where: { id: orderId } })).pipe(
      switchMap((order) => {
        if (!order) {
          return throwError(() => new Error('Porudžbina nije pronađena!'));
        }

        if (productId) {
          
          return from(this.productRepository.findOne({ where: { id: productId } })).pipe(
            switchMap((product) => {
              if (!product) {
                return throwError(() => new Error('Proizvod nije pronađen!'));
              }
              

              const orderItem = this.orderItemRepository.create({
                order: order,
                product: product,
              
                quantity: quantity,
                addInfo: addInfo,
              });

              return from(this.orderItemRepository.save(orderItem));
            }),
          );
        } else if (serviceId) {
          
          return from(this.serviceRepository.findOne({ where: { id: serviceId } })).pipe(
            switchMap((service) => {
              if (!service) {
                return throwError(() => new Error('Usluga nije pronađena!'));
              }

              const orderItem = this.orderItemRepository.create({
                order: order,
                service: service,
                quantity: quantity,
                addInfo: addInfo,
              });

              return from(this.orderItemRepository.save(orderItem));
            }),
          );
        } else {
          return throwError(() => new Error('Nije postavljen ni proizvod ni usluga!'));
        }
      }),
      catchError((error) => throwError(() => error)),
    );
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