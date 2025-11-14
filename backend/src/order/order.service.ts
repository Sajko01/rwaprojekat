import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './order.dtoc';
import { Observable, catchError, combineLatest, forkJoin, from, map, mergeMap, of, reduce, switchMap, throwError } from 'rxjs';
import { User } from 'src/user/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cartitem/cartItem.entity';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';
import { OrderItem } from 'src/orderitem/orderitem.entity';
@Injectable()export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}


  async getOrdersByUserEmail(userEmail: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { email: userEmail } },
      relations: ['orderItems'], 
      order: { orderDate: 'DESC' },
    });
  }  


  async getAllOrdersForAdmin(): Promise<Order[]> {
    
    return this.orderRepository.find({
      relations: ['orderItems'], 
      order: { orderDate: 'DESC' },
    });
  }  


  create(createOrderDto: CreateOrderDto): Observable<Order> {
    const { userEmail, cartId, ...orderData } = createOrderDto;

    return from(this.userRepository.findOne({ where: {email: userEmail} })).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Korisnik nije pronađen!'));
        }

        return from(this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems'] })).pipe(
          switchMap((cart) => {
            if (!cart) {
              
              return throwError(() => new Error('Korpa nije pronađena!'));
            }
           

            return from(this.calculateTotalPrice(cart.cartItems)).pipe(
              switchMap((totalPrice,orderLocation) => {
                const order = this.orderRepository.create({
                  ...orderData,
                  user,
                  cart,
                  totalPrice,
                  orderLocation:cart.location,
                });

                return from(this.orderRepository.save(order)).pipe(
                  switchMap((savedOrder) => {
                    
                    const orderItems = cart.cartItems.map((cartItem) => {

                     if (cartItem.product) {
                      
                      cartItem.product.quantity -= cartItem.quantity;

                      this.productRepository.save(cartItem.product).then((updatedProduct) => {
                        console.log('Proizvod ažuriran:', updatedProduct);
                      })
                      .catch((error) => {
                        console.error('Greška prilikom ažuriranja količine proizvoda:', error);
                      });
                  }

                      return this.orderItemRepository.create({
                        order: savedOrder,
                        product: cartItem.product,
                        service: cartItem.service,
                        quantity: cartItem.quantity,
                        addInfo: cartItem.addInfo,
                      });
                    });
  
                
                    return from(this.orderItemRepository.save(orderItems)).pipe(
                      map(() => savedOrder) 
                    );
                  })
                );
              })
            );
          })
        );
      }),
      catchError((error) => throwError(() => error)),
    );
  }


  private calculateTotalPrice(cartItems: CartItem[]): Observable<number> {
    const productObservables = cartItems
      .filter(item => item.product)
      .map(item => 
        from(this.productRepository.findOne({ where: { id: item.product.id } }))
          .pipe(map(product => (product ? product.price * item.quantity : 0)))
      );
  
    const serviceObservables = cartItems
      .filter(item => item.service)
      .map(item =>
        from(this.serviceRepository.findOne({ where: { id: item.service.id } }))
          .pipe(map(service => (service ? service.pricePerUnit * item.quantity : 0)))
      );
  
    return forkJoin([...productObservables, ...serviceObservables]).pipe(
      map(prices => prices.reduce((acc, price) => acc + price, 0)) 
    );
  }

//nije uspela 
  getCartTotal(cartId): Observable<number> {
    return combineLatest([
      this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems'] }),
      this.productRepository.find(),
      this.serviceRepository.find()
    ]).pipe(
      map(([cart, products, services]) => {
        if (!cart || !cart.cartItems) return 0;
  
        return cart.cartItems.reduce((total, item) => {
          if (item.product) {
            const product = products.find(p => p.id === item.product.id);
            total += (product?.price || 0) * item.quantity;
          } else if (item.service) {
            const service = services.find(s => s.id === item.service.id);
            total += (service?.pricePerUnit || 0) * item.quantity;
          }
          return total;
        }, 0);
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return from(this.orderRepository.find());
  }

  getOrder(id: number): Observable<Order> {
    return from(this.orderRepository.findOne({ where: { id: id } }));
  }

  
  getOrdersForUser(idUser: number): Observable<Order[]> {
    return from(this.userRepository.findOne({ where: { id: idUser }, relations: ['orders'] })).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Korisnik nije pronađen.'));
        }

        return from(this.orderRepository.find({ where: { user: { id: user.id } }, relations: ['orderItems', 'cart'] })).pipe(
          switchMap((orders) => {
            if (!orders || orders.length === 0) {
              return of([]); 
            }
            return of(orders);
          }),
          catchError((error) => throwError(() => error))
        );
      }),
      catchError((error) => throwError(() => error))
    );
  }

  updateOrder(id: number, order: Order): Observable<UpdateResult> {
    return from(this.orderRepository.update(id, order));
  }

  deleteOrder(id: number): Observable<DeleteResult> {
    return from(this.orderRepository.delete(id));
  }

  
 
  async deleteOrderById(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['orderItems'] });
  
    if (!order) {
      throw new NotFoundException(`Porudžbina sa id'jem ${orderId} nije nađena!`);
    }
  
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000; 
    const timeDifference = now.getTime() - new Date(order.orderDate).getTime();
  
    if (timeDifference > fiveMinutes) {
      throw new BadRequestException('Možes obrisati porudžinu u roku od 5 minuta od poručivanja!');
    }

    for (const orderItem of order.orderItems) {
      if (orderItem.product) { 
        orderItem.product.quantity += orderItem.quantity;
  
        
        await this.productRepository.save(orderItem.product);
      }
    }
  
    await this.orderRepository.remove(order);
  }



}