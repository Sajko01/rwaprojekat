import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [AppComponent],
//   imports: [BrowserModule],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}


import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects'
;import { StoreDevtoolsModule } from '@ngrx/store-devtools';
@NgModule({
  declarations: [AppComponent],
  imports: [
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    BrowserModule
  ],
  bootstrap: [AppComponent]
})export class AppModule {}