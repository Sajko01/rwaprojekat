import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './cart.dtoc';
import { Observable, catchError, combineLatest, from, of, switchMap, throwError } from 'rxjs';
import { User } from 'src/user/user.entity';
import { CartItem } from 'src/cartitem/cartItem.entity';


@Injectable()export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>
  ) {}

   
  create(createCartDto: CreateCartDto): Observable<Cart> {
    const { userEmail, location } = createCartDto;

    return from(this.userRepository.findOne({ where: { email: userEmail } })).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Korisnik nije pronađen.'));
        }

        const cart = this.cartRepository.create({
          user: user, 
          location: location, 
        });

        return from(this.cartRepository.save(cart));
      }),
      catchError((error) => throwError(() => error)),
    );
  }

 


  getCartForUser(emailUser: string): Observable<number> { // Vraća Observable broja (ID korpe)
    return from(this.userRepository.findOne({ where: { email: emailUser }, relations: ['carts'] })).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Korisnik nije pronađen.'));
        }
  
        return from(this.cartRepository.findOne({ where: { user: { id: user.id } } })).pipe(
          switchMap((cart) => {
            if (!cart) {
              return null;//ne baca gresku vec null ybog logike 
              throwError(() => new Error('Korpa nije pronađena.'));
            }
            return of(cart.id); // Vraća samo ID korpe
          }),
          catchError((error) => throwError(() => error))
        );
      }),
      catchError((error) => throwError(() => error))
    );
  }
  
  



  
  getCartItemsForUser(id: number): Observable<CartItem[]> {
    return from(this.userRepository.findOne({ where: { id: id }, relations: ['carts'] })).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Korisnik nije pronađen'));
        }

        // Pretpostavljamo da korisnik ima samo jednu korpu
        const cart = user.carts[0]; 

        if (!cart) {
          return of([]); // Ako korisnik nema korpu, vraća prazan niz
        }
        //vratimo stavke korpe sa veyama prema proiyvodima i uslugama ya lakse manim
        return from(this.cartItemRepository.find({ where: { cart: { id: cart.id } }, relations: ['product', 'service'] })).pipe(
          switchMap((cartItems) => {
            if (!cartItems || cartItems.length === 0) {
              return of([]); // Ako nema stavki u korpi, vraća prazan niz
            }
            return of(cartItems);
          }),
          catchError((error) => throwError(() => error))
        );
      }),
      catchError((error) => throwError(() => error))
    );
  } 
    
  

  getAllCarts(): Observable<Cart[]> {
    return from(this.cartRepository.find());
  }

  async getCartLocationByUserEmail(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['carts'] });
    if (user && user.carts && user.carts.length > 0) {
      return user.carts[0].location; // Pretpostavka da korisnik ima jednu korpu
    }
    return null;
  }

  

  getCart(id: number): Observable<Cart> {
    return from(this.cartRepository.findOne({ where: { id: id } }));
  }

  updateCart(id: number, cart: Cart): Observable<UpdateResult> {
    return from(this.cartRepository.update(id, cart));
  }

  updateCartLocation(id: number, location: string): Observable<UpdateResult> {
    // Prvo proveravamo da li korpa sa datim ID-jem postoji
    return from(this.cartRepository.findOne({ where: { id: id } })).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('Korpa nije pronađena!'));
        }
  
        // Ažuriramo samo polje `location`
        return from(this.cartRepository.update(id, { location }));
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  deleteCart(id: number): Observable<DeleteResult> {
    return from(this.cartRepository.delete(id));
  }

  async getCartLocationById(cartId: number): Promise<string | null> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (cart) {
      return cart.location;
    }
    return null;
  }
}