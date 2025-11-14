import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ServicesComponent } from './components/services.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceEffects } from './state/services.effects';
import { serviceReducer } from './state/services.reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [
    ServicesComponent,
  ],
  imports: [
    StoreModule.forFeature('serviceState', serviceReducer),
   EffectsModule.forFeature([ServiceEffects]),
    CommonModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  exports: [
   ServicesComponent,
  ]
})
export class ServicesModule { }