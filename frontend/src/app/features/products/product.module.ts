import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ProductsComponent } from './components/products.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions } from '@angular/material/dialog';
import { ProductEffects } from './state/products.effects';
import { productReducer} from './state/products.reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [

    CommonModule, 
    HttpClientModule,
    FormsModule,
    MatDialogActions,
    ReactiveFormsModule,
    StoreModule.forFeature('products', productReducer),
    EffectsModule.forFeature([ProductEffects]),
    
  ],
  exports: [
    ProductsComponent,
  ]
})
export class ProductsModule { }