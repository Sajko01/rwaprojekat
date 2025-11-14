import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CartItem } from './cartItem.entity';
import { CartItemService } from './cartItem.service';
import { CreateCartItemDto } from './cartItem.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Roles } from 'src/role/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { UserRole } from 'src/user/user.entity';

@Controller('cart-item')export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  create(@Body() cartItem: CreateCartItemDto): Observable<CartItem> {
    return this.cartItemService.create(cartItem);
  }

  @Get(':cartId')
  async getCartItems(@Param('cartId') cartId: number): Promise<CartItem[]> {
    return this.cartItemService.findAllByCartId(cartId);
  }

  @Get()
  getAll(): Observable<CartItem[]> {
    return this.cartItemService.getAllCartItems();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Put(':id/quantity')
  async updateCartItemQuantity(
    @Param('id') id: number,
    @Body('quantity') quantity: number,
  ): Promise<CartItem> {
    return this.cartItemService.updateCartItemQuantity(id, quantity);
  }

  @Put(':id')
  updateCartItem(
    @Param('id') id: number,
    @Body() cartItem: CartItem,
  ): Observable<UpdateResult> {
    return this.cartItemService.updateCartItem(id, cartItem);
  }

  @Delete(':id')
  deleteCartItem(@Param('id') id: number): Observable<DeleteResult> {
    return this.cartItemService.deleteCartItem(id);
  }

 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Delete('delete-by-cart-product/:cartId/:productId')
  async deleteCartItemsByCartAndProductId(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.cartItemService.deleteCartItemsByCartAndProductId(cartId, productId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Greška: ${error.message}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)

  @Delete('delete-by-cart-service/:cartId/:serviceId')
  async deleteCartItemsByCartAndServiceId(
    @Param('cartId') cartId: number,
    @Param('serviceId') serviceId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.cartItemService.deleteCartItemsByCartAndServiceId(cartId, serviceId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Greška: ${error.message}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
 

  @Get('is-in-cart/:cartId/:productId')
  async isProductInCart(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ): Promise<boolean> {
    return this.cartItemService.isProductInCart(cartId, productId);
  }


  @Get('products-in-cart/:cartId')
async getProductsInCart(@Param('cartId') cartId: number) {
  return this.cartItemService.getProductsInCart(cartId);
}

  @Get('is-in-cart-s/:cartId/:serviceId')
  async isServiceInCart(
    @Param('cartId') cartId: number,
    @Param('serviceId') serviceId: number,
  ): Promise<boolean> {
    return this.cartItemService.isServiceInCart(cartId, serviceId);
  }




  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Delete('delete-by-cart/:cartId')
  async deleteCartItemsByCartId(
    @Param('cartId') cartId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.cartItemService.deleteCartItemsByCartId(cartId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Greška: ${error.message}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':cartId/is-empty')
  async isCartEmpty(@Param('cartId') cartId: number): Promise<{ isEmpty: boolean }> {
    const isEmpty = await this.cartItemService.isEmptyCart(cartId);
    return { isEmpty };
  }
}