import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../auth/auth.state';
import { logout } from '../../../auth/auth.actions';
import { selectIsLoggedIn, selectUserNick, selectUserRole } from '../../../auth/auth.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})


export class HeaderComponent {
  @Input()
  appName: string = ""
  @Input()
  links: { label: string, route: string,requiresAuth:boolean }[] = [];
  
  isLoggedIn$: Observable<boolean>;
  userNick$: Observable<string | undefined>; 
  userRole$: Observable<string | undefined>; 

  constructor(private store: Store<AuthState>) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userNick$ = this.store.select(selectUserNick);
    this.userRole$ = this.store.select(selectUserRole); 
  }
  logout() {
    this.store.dispatch(logout());
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
