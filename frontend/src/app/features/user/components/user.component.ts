import { Component } from '@angular/core';
import { AuthDto, CreateCartDto, CreateUserDto } from '../interfaces/auth'; 
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import { login } from '../../../auth/auth.actions';
import { CartService } from '../../cart/services/cart.service';
import { AuthState } from '../../../auth/auth.state';
import { logout } from '../../../auth/auth.actions';
import { selectIsLoggedIn, selectUserCartId, selectUserNick, selectUserRole } from '../../../auth/auth.selectors';
import { async, filter, Observable, of, switchMap, tap } from 'rxjs';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  isLogin: boolean = true; 
  userDto: CreateUserDto = { email: '', password: '' , nick: '',address:''}; 
  cartDto: CreateCartDto = { userEmail: '', location: '' };
  uNick:string;
  newLocation:string;
  location$: Observable<{ location: string }> | null = null;
  isLoggedIn$: Observable<boolean>;
  userNick$: Observable<string | undefined>; 
  userRole$: Observable<string | undefined>;
  userCartId$: Observable<number | undefined>;

  constructor(private userService: UserService,private store: Store<AuthState>,private cartService:CartService, private dialog: MatDialog) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userNick$ = this.store.select(selectUserNick); 
    this.userRole$ = this.store.select(selectUserRole);
    this.userCartId$=this.store.select(selectUserCartId);
    this.uNick='';
    this.newLocation="";

  
  }

  logout() {
    window.location.reload();
    this.store.dispatch(logout());
    window.scrollTo({ top: 0, behavior: 'smooth' }); 

  }

  ngOnInit(){
    this.userCartId$.subscribe(cartId => {
    if (cartId !== undefined) {
      this.location$ = this.cartService.getCartLocationById(cartId);
    } else {
      this.location$=null;
  
    }
  });
  }


  toggleForm() {
    this.isLogin = !this.isLogin; 
  }
   

  onLocationUpdate() {
  this.userCartId$
    .pipe(
      filter((cartId): cartId is number => cartId !== undefined), 
      switchMap(cartId =>
        this.cartService.updateCartLocation(cartId, this.newLocation).pipe(
          tap(response => console.log('Lokacija uspešno ažurirana:', response)),
          switchMap(() => this.cartService.getCartLocationById(cartId))
        )
      )
    )
    .subscribe({
      next: (location) => {
        this.location$ = of(location);
      },
      error: (error) => {
        console.error('Greška prilikom ažuriranja lokacije:', error);
      }
    });
}

  

  
  onAddressSubmit(loc:string) {
      this.cartDto.userEmail = this.userDto.email || '';  
      this.cartDto.location=loc;
      this.cartService.create(this.cartDto).subscribe(
        (cart) => {
          console.log('Korpa je kreirana:', cart);
        },
        (error) => {
          console.error('Greška prilikom kreiranja korpe:'+this.cartDto.userEmail+this.cartDto.location, error);
        }
      );

  }

  onSubmit( ) {
    if (this.isLogin) {
      
      const authData: AuthDto = { email: this.userDto.email, password: this.userDto.password,nick:this.userDto.nick};
      this.userService.login(authData).subscribe(
        (response) => {
          console.log('Uspesno prijavljen', response);
          this.store.dispatch(login({ nick: response.email,role:response.role,token:response.access_token ,cartId:response.cartId})); 
        },
        (error) => {
          console.error('Greska prilikom prijave:', error);
          this.openAlertDialog('Neuspešna prijava. Proverite email i lozinku!');
        }
      );
    } else {
     
      if (!this.isValidEmail(this.userDto.email)) {
        this.openAlertDialog('Neispravan email');
        return;
      }
  
      if (!this.isValidPassword(this.userDto.password)) {
        this.openAlertDialog('Lozinka mora imati bar 8 karaktera i bar jedan broj!');
        return;
      }
      if(this.userDto.address=='')
      {
        this.openAlertDialog('Unesite adresu!');
        return;

      }
      this.userService.createUser(this.userDto).subscribe(
        (response) => {
         
         this.onAddressSubmit(this.userDto.address);
         
          console.log('Uspesno registrovan!', response),
          this.toggleForm();
         },

         (error) => {
          console.error('Greska prilikom registracije:', error);
          this.openAlertDialog('Greška prilikom registracije! Pokušajte ponovo.');
        }
      );
    }
  }


  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  isValidPassword(password: string): boolean {
    return password.length >= 8 && /[0-9]/.test(password);
  }
  
  openAlertDialog(message: string): void {
    this.dialog.open(AlertComponent, {
      data: { message: message },
    });

   }

}

