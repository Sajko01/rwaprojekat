import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration()]
};


//OVDE TREBA PROMENA DA SE UVEZE NGRX..... 

// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideClientHydration } from '@angular/platform-browser';
// import { provideStore } from '@ngrx/store';
// import { provideEffects } from '@ngrx/effects';
// import { provideStoreDevtools } from '@ngrx/store-devtools';

// // Importuj svoje reducere i efekte
// import { reducers } from './reducers';  // Uvezi svoje reducere
// import { MyEffects } from './effects';  // Uvezi svoje efekte

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideClientHydration(),
//     provideStore(reducers),  // Registruj reducere
//     provideEffects([MyEffects]),  // Registruj efekte
//     provideStoreDevtools({ maxAge: 25 }),  // Registruj Store DevTools
//   ],
// };

