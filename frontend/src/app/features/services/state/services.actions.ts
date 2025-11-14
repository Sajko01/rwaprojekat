import { createAction, props } from '@ngrx/store';
import { Service } from '../interfaces/service';

export const loadServices = createAction(
  '[Services] Load Services'
);

export const loadServicesSuccess = createAction(
  '[Services] Load Services Success',
  props<{ services: Service[] }>()
);
export const loadServicesFailure = createAction(
  '[Services] Load Services Failure',
  props<{ error: any }>()
);

export const createService = createAction(
  '[Service] Create Service',
  props<{ service: Service, image: File }>()
);

export const createServiceSuccess = createAction(
  '[Service] Create Service Success',
  props<{ service: Service }>()
);

export const createServiceFailure = createAction(
  '[Service] Create Service Failure',
  props<{ error: any }>()
);




export const deleteService = createAction(
  '[Service] Delete Service',
  props<{ id: number }>()
);

export const deleteServiceSuccess = createAction(
  '[Service] Delete Service Success',
  props<{ id: number }>()
);

export const deleteServiceFailure = createAction(
  '[Service] Delete Service Failure',
  props<{ error: any }>()
);


export const updatePrice = createAction(
    '[Service] Update Price',
    props<{ serviceId: number; newPrice: number }>()
  );
  
  export const updatePriceSuccess = createAction(
    '[Service] Update Price Success',
    props<{ serviceId: number; newPrice: number }>()
  );
  
  export const updatePriceFailure = createAction(
    '[Service] Update Price Failure',
    props<{ error: any }>()
  );


  export const addToCart = createAction(
    '[Cart] Add Service to Cart',
    props<{ cartItem: any }>() 
  );
  
  export const addToCartSuccess = createAction(
    '[Cart] Add Service to Cart Success',
    props<{ cartItem: any }>() 
  );
  
  export const addToCartFailure = createAction(
    '[Cart] Add Service to Cart Failure',
    props<{ error: any }>()
  );

  export const deleteCartItems = createAction(
    '[Cart] Delete Cart Items',
    props<{ cartId: number;serviceId: number }>()
  );
  
  export const deleteCartItemsSuccess = createAction(
    '[Cart] Delete Cart Items Success',
    props<{ serviceId: any }>()
  );
  
  export const deleteCartItemsFailure = createAction(
    '[Cart] Delete Cart Items Failure',
    props<{ error: any }>()
  );