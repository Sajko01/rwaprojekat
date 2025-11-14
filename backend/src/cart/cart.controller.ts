import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CreateCartDto } from './cart.dtoc';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CartItem } from 'src/cartitem/cartItem.entity';

@Controller('cart')export class CartController {
  constructor(private cartService: CartService) {}

  @Get('user/:email')
  getCartForUser(@Param('email') email: string): Observable<Number> {
    return this.cartService.getCartForUser(email).pipe(
      catchError((error) => {
        throw new NotFoundException('Korisnik ili korpa nisu pronađeni.');
      })
    );
  }

  @Get('location/:email')
  async getCartLocationByEmail(@Param('email') email: string): Promise<{ location: string }> {
    const location = await this.cartService.getCartLocationByUserEmail(email);
    if (location) {
      return { location };
    } else {
      return { location: 'Nije pronađena korpa za ovog korisnika!' };
    }
  }


  @Post()
  create(@Body() cart: CreateCartDto): Observable<Cart> {
    return this.cartService.create(cart);
  }

  @Get(':id')
  getCartItemsForUser(@Param('id') id: number): Observable<CartItem[]> {
    return this.cartService.getCartItemsForUser(id).pipe(
      switchMap((cartItems) => {
        if (!cartItems || cartItems.length === 0) {
          return throwError(() => new NotFoundException('Nema stavki u korpi za ovog korisnika.'));
        }
        return of(cartItems);
      }),
      catchError((error) => {
        console.error('Greška preuzimanja stavki iz korpe!:', error);
        return throwError(() => new InternalServerErrorException('Došlo je do greške prilikom preuzimanja stavki korpe!'));
      })
    );
  }

  @Get()
  getAll(): Observable<Cart[]> {
    return this.cartService.getAllCarts();
  }

  @Get(':id/cart')
  getCart(@Param('id') id: number): Observable<Cart> {
    return this.cartService.getCart(id);
  }

  @Put(':id')
  updateCart(
    @Param('id') id: number,
    @Body() cart: Cart,
  ): Observable<UpdateResult> {
    return this.cartService.updateCart(id, cart);
  }

  @Patch(':id/location')
  updateCartLocation(
    @Param('id') id: number,
    @Body('location') location: string,
  ): Observable<UpdateResult> {
    return this.cartService.updateCartLocation(id, location);
  }

  @Delete(':id')
  deleteCart(@Param('id') id: number): Observable<DeleteResult> {
    return this.cartService.deleteCart(id);
  }


  @Get('location/cart/:id')
  async getCartLocationById(@Param('id') id: number): Promise<{ location: string }> {
    const location = await this.cartService.getCartLocationById(id);
    if (location) {
      return { location };
    } else {
      return { location: 'Nije pronađena korpa sa ovim id-jem!' };
    }
  }
}