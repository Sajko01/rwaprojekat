import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OrdersComponent } from './components/orders.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffects } from './state/orders.effects';
import { orderReducer } from './state/orders.reducers';


@NgModule({
  declarations: [
    OrdersComponent,
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    FormsModule,
    StoreModule.forFeature('orders', orderReducer), 
    EffectsModule.forFeature([OrderEffects]) 
  ],
  exports: [
    OrdersComponent,
  ]
})
export class OrderModule { }