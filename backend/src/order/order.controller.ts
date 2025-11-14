import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Order } from './order.entity'
;import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dtoc';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Roles } from 'src/role/roles.decorator';
import { UserRole } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('order')export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('user-order-items/:userEmail')
  async getOrdersByUserEmail(@Param('userEmail') userEmail: string): Promise<Order[]> {
    return this.orderService.getOrdersByUserEmail(userEmail);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all-orders')
  async getAllOrdersForAdmin(): Promise<Order[]> {
    return this.orderService.getAllOrdersForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  create(@Body() order: CreateOrderDto): Observable<Order> {
    return this.orderService.create(order);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('cart-total/:cartId')
  getCartTotal(@Param('cartId') cartId: number): Observable<number> {
    return this.orderService.getCartTotal(cartId);
  }

  @Get('user/:id')
  getOrdersForUser(@Param('id') idUser: number): Observable<Order[]> {
    return this.orderService.getOrdersForUser(idUser).pipe(
      switchMap((orders) => {
        if (!orders || orders.length === 0) {
          return throwError(() => new NotFoundException('Nema narudžbi za ovog korisnika!'));
        }
        return of(orders);
      }),
      catchError((error) => {
        console.error('Greška pri dohvatanju narudžbine!:', error);
        return throwError(() => new InternalServerErrorException('Došlo je do greške prilikom preuzimanja narudžbi!'));
      })
    );
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.orderService.deleteOrderById(id);
  }
}