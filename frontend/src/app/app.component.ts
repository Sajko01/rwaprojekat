import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  name = 'EkoVrt';
  links = [
    { label: 'Proizvodi', route: '/products',requiresAuth:false },
    { label: 'Usluge', route: '/services',requiresAuth:false },
    { label: 'Korpa', route: '/cart' ,requiresAuth:true},
    { label: 'Porudžbine', route: '/orders',requiresAuth:true},
    { label: 'Korisnik', route: '/user',requiresAuth:false }
  ];
}

