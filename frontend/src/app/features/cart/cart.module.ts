import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './components/cart.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { cartReducer } from './state/carts.reducers';
import { CartEffects } from './state/carts.effects';



@NgModule({
  declarations: [
    CartComponent,
  ],
  imports: [
  
    CommonModule, 
    HttpClientModule,
    FormsModule,
    StoreModule.forFeature('cart', cartReducer),
    EffectsModule.forFeature([CartEffects]),
  ],
  exports: [
    CartComponent,
  ]
})
export class CartModule { }