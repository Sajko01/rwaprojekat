import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, IsNull, Not, Repository, UpdateResult } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { CreateCartItemDto } from './cartItem.dtoc';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/product/product.entity';
import { Service } from 'src/service/service.entity';

@Injectable()export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>
  ) {}
  
  async findAllByCartId(cartId: number): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { cart: { id: cartId } },
      relations: ['product', 'service'], 
    });
  }


  create(createCartItemDto: CreateCartItemDto): Observable<CartItem> {
    const { cartId, productId, serviceId, quantity, ...cartItemData } = createCartItemDto;
  
    if (quantity <= 0) {
      return throwError(() => new Error('Količina mora biti pozitivna!'));
    }
  
    return from(this.cartRepository.findOne({ where: { id: cartId } })).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('Korpa nije pronađena!'));
        }
  
        const existingItem$ = from(this.cartItemRepository.findOne({
          where: {
            cart: { id: cartId },
            ...(productId ? { product: { id: productId } } : { service: { id: serviceId } })
          }
        }));
  
        return existingItem$.pipe(
          switchMap((existingItem) => {
            if (existingItem) {
              return throwError(() => new Error('Stavka sa ovim proizvodom ili uslugom već postoji u korpi!'));
            }
  
            if (productId) {
              return from(this.productRepository.findOne({ where: { id: productId } })).pipe(
                switchMap((product) => {
                  if (!product) {
                    return throwError(() => new Error('Proizvod nije pronađen!'));
                  }
  
                  const cartItem = this.cartItemRepository.create({
                    ...cartItemData,
                    cart,
                    product,
                    service: null,
                    quantity,
                  });
  
                  return from(this.cartItemRepository.save(cartItem));
                })
              );
            } else if (serviceId) {
              return from(this.serviceRepository.findOne({ where: { id: serviceId } })).pipe(
                switchMap((service) => {
                  if (!service) {
                    return throwError(() => new Error('Usluga nije pronađena!'));
                  }
  
                  const cartItem = this.cartItemRepository.create({
                    ...cartItemData,
                    cart,
                    product: null,
                    service,
                    quantity,
                  });
  
                  return from(this.cartItemRepository.save(cartItem));
                })
              );
            } else {
              return throwError(() => new Error('Proizvod ili usluga mora biti postavljena!'));
            }
          })
        );
      }),
      catchError((error) => throwError(() => error)),
    );
  }
  

  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: id },
    });
    if (!cartItem) {
      throw new Error('Stavka u korpi nije pronađena!');
    }
    cartItem.quantity = quantity;
    return this.cartItemRepository.save(cartItem);
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
 

  async deleteCartItemsByCartAndProductId(cartId: number, productId: number): Promise<DeleteResult> {
    const items = await this.cartItemRepository.find({
      where: { cart: { id: cartId }, product: { id: productId } },
    });

    if (!items || items.length === 0) {
      throw new Error(`Nema stavki u korpi sa proizvodom ID: ${productId} i korpom ID: ${cartId}`);
    }

    return this.cartItemRepository.delete({ cart: { id: cartId }, product: { id: productId } });
  }

  async isProductInCart(cartId: number, productId: number): Promise<boolean> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cartId }, product: { id: productId } },
    });


    return !!cartItem;
  }

  async getProductsInCart(cartId: number): Promise<{ id: number; name: string; quantity: number }[]> {
  const cartItems = await this.cartItemRepository.find({
    where: { cart: { id: cartId }, product: Not(IsNull()) }, 
    relations: ['product']
  });

  return cartItems.map(item => ({
    id: item.product.id,
    name: item.product.name,
    quantity: item.quantity
  }));
}

  async deleteCartItemsByCartAndServiceId(cartId: number, serviceId: number): Promise<DeleteResult> {
    const items = await this.cartItemRepository.find({
      where: { cart: { id: cartId }, service: { id: serviceId } },
    });

    if (!items || items.length === 0) {
      throw new Error(`Nema stavki u korpi sa uslugom ID: ${serviceId} i korpom ID: ${cartId}`);
    }
    return this.cartItemRepository.delete({ cart: { id: cartId }, service: { id: serviceId } });
  }

  async isServiceInCart(cartId: number, serviceId: number): Promise<boolean> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cartId }, service: { id: serviceId } },
    });

    
    return !!cartItem;
  }




  async deleteCartItemsByCartId(cartId: number): Promise<DeleteResult> {
    const items = await this.cartItemRepository.find({
      where: { cart: { id: cartId } },
    });
    
    if (!items || items.length === 0) {
      throw new Error(`Nema stavki u korpi sa  ID: ${cartId}`);
    }

    return this.cartItemRepository.delete({ cart: { id: cartId } });
  }


  async isEmptyCart(cartId: number): Promise<boolean> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cartId }},
    });

  
    return !cartItem;
  }
  
}