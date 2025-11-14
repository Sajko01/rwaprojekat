import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {  RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from './core/core.module';
import { ProductsModule } from './features/products/product.module';
import { ServicesModule } from './features/services/service.module';
import { authReducer } from './auth/auth.reducer';
import { CartModule } from './features/cart/cart.module';
import { FormsModule } from '@angular/forms';
import { OrderModule } from './features/orders/order.module';
import { UsersModule } from './features/user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
  StoreModule.forRoot({}),
    CommonModule,
    BrowserModule,
    StoreModule.forRoot({auth: authReducer}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    RouterModule.forRoot(routes),
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule,
    CoreModule,// cache bio problem ng cache..
    ProductsModule,
    ServicesModule, 
    CartModule,
    FormsModule,
    OrderModule,
    UsersModule,
   

  ],
  bootstrap: [AppComponent],
  exports:[RouterModule]
})export class AppModule {}