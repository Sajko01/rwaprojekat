import {  ChangeDetectorRef, Component } from '@angular/core';
import { CartItem } from '../interfaces/cart';
import { CartService } from '../services/cart.service';
import { selectIsLoggedIn, selectUserCartId, selectUserNick } from '../../../auth/auth.selectors';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, filter, forkJoin, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../auth/auth.state';
import { CreateOrderDto } from '../../orders/interfaces/order';
import { OrderService } from '../../orders/services/order.service';
import { Router } from '@angular/router';
import * as CartActions from '../state/carts.actions';
import { submitOrder } from '../../orders/state/orders.actions';
import { selectCartItems, selectIsCartEmpty } from '../state/carts.selectors';
import { selectOrderState } from '../../orders/state/orders.selectors';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  
  cartItems: CartItem[] = [];
  cartId: number=0;
  userEmail: string = '';
  totalPrice: number | null = null;
  cartIsEmpty$: Observable<boolean>; 
  private orderMakedSubject = new BehaviorSubject<boolean>(false);
  orderMaked$ = this.orderMakedSubject.asObservable();
  orderInfo: string = ''; 
  cartItems$: Observable<CartItem[]>;
  tempQuantities: { [key: number]: number } = {};
  isSubmitting: boolean = false;





  
  isLoggedIn$: Observable<boolean>;
  userNick$: Observable<string | undefined>; 
  userCartId$: Observable<number | undefined>;

  constructor(private store: Store<AuthState>,private http: HttpClient,private cartService:CartService,private orderService: OrderService,private router:Router, private cdr: ChangeDetectorRef) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userNick$ = this.store.select(selectUserNick); 
    this.userCartId$=this.store.select(selectUserCartId);
    this.cartItems$ = this.store.select(selectCartItems);
     this.cartIsEmpty$ = this.store.select(selectIsCartEmpty); 
   
  
  }
  scrollToProducts() {
    this.router.navigate(['/products']).then(() => {
      setTimeout(() => {
        const element = document.getElementById('products-section');
        if (element) {
          const yOffset = -40; 
          const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: yPosition, behavior: 'smooth' });
        }
      }, 200); 
    });
  }

  scrollToServices() {

    this.router.navigate(['/services']).then(() => {

      setTimeout(() => {
        const element = document.getElementById('services-section');
        if (element) {
          const yOffset = -100; 
          const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: yPosition, behavior: 'smooth' });
        }
      }, 200); 
    });
  }

  scrollToOrders() {

    this.router.navigate(['/orders']).then(() => {
      setTimeout(() => {

          window.scrollTo({ top: 0, behavior: 'smooth' });
        
      }, 200); 
    });
  }


  ngOnInit(): void {
     this.cartIsEmpty$=this.store.select(selectIsCartEmpty);

    this.orderMakedSubject.next(false);

    this.userCartId$
    .pipe(
      switchMap((cartId) => {
        if (cartId) {
          
          return of(cartId); 
        } else {
          return of(null); 
        }
      })
    )
    .subscribe({
      next: (cartId) => {
        if (cartId) {
          this.loadCartItems(cartId);  
        } else {
        
        }
      },
      error: (error) => {
        console.error('Greška prilikom dobijanja ID-a korpe:', error);

      }
    });
  
  
    this.cartItems$.subscribe(cartItems => {
      cartItems.forEach(item => {
        this.tempQuantities[item.id] = item.quantity || 1; 
      });


      this.cdr.detectChanges();
    });

  
  }

  


  updateQuantity(cartItemId: number, newQuantity: number): void {
    this.store.dispatch(CartActions.updateCartItemQuantity({ cartItemId, quantity: newQuantity }));
  

  }
 

  

  deleteCartItems(productId: number, productOrService: boolean) {
  
    this.userCartId$
      .pipe(
        switchMap((cartId) => {
          if (cartId) {
            this.cartId = cartId;  
            return of(cartId); 
          } else {
            return of(null); 
          }
        })
      )
      .subscribe({
        next: (cartId) => {
          if (cartId) {
            if (productOrService) {
              this.store.dispatch(CartActions.deleteCartItem({ cartId: this.cartId, productId }));

            } else {
              
              var serviceId=productId;
              this.store.dispatch(CartActions.deleteCartItemByService({ cartId: this.cartId, serviceId }));
            
            }
            

          } 
        },
        error: (error) => {
          console.error('Greška prilikom brisanja stavke:', error);
          this.cartId = 0;  
        }
      });
  
 
  }
  

  loadCartItems(cartId: number): void {
    this.store.dispatch(CartActions.loadCartItems({ cartId }));
  }


  submitOrder(): void {
  if (this.isSubmitting) return;

  this.isSubmitting = true;

  combineLatest([this.userNick$, this.userCartId$]).pipe(
    take(1) 
  ).subscribe({
    next: ([email, cartId]) => {
      if (email && cartId) {
        this.userEmail = email;
        this.cartId = cartId;

        const orderDto: CreateOrderDto = {
          id: 0,
          userEmail: this.userEmail,
          cartId: this.cartId,
          totalPrice: this.totalPrice || 0,
          orderDate: new Date(),
          orderInfo: this.orderInfo
        };

        this.store.dispatch(submitOrder({ orderDto }));
        this.orderMakedSubject.next(true);

        this.store.select(selectOrderState).subscribe(orderState => {
          if (orderState.orderMade) {
            this.orderMakedSubject.next(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.store.dispatch(CartActions.clearCart({ cartId: this.cartId }));
          }
          this.isSubmitting = false;
        });
      } else {
        console.error('Nedostaje email ili cartId!');
        this.isSubmitting = false;
      }
    },
    error: () => {
      this.isSubmitting = false;
    }
  });
}
  

  


  getImageUrl(imagePath: string): string {
    return `http://localhost:3000/img/${imagePath}`;
  }

}

