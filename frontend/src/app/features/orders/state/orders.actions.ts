import { createAction, props } from '@ngrx/store';
import { CreateOrderDto, OrderDto } from '../interfaces/order';


export const loadOrders = createAction(
    '[Orders] Load Orders',
    props<{ userEmail: string }>() 
  );
  
  export const loadOrdersSuccess = createAction(
    '[Orders] Load Orders Success',
    props<{ orders: OrderDto[] }>()
  );
  
  export const loadOrdersFailure = createAction(
    '[Orders] Load Orders Failure',
    props<{ error: string }>()
  );


  export const deleteOrder = createAction(
    '[Order] Delete Order',
    props<{ orderId: number }>()
  );
  
  export const deleteOrderSuccess = createAction(
    '[Order] Delete Order Success',
    props<{ orderId: number }>()
  );
  
  export const deleteOrderFailure = createAction(
    '[Order] Delete Order Failure',
    props<{ error: any }>()
  );

  export const submitOrder = createAction(
    '[Order] Submit Order',
    props<{ orderDto: CreateOrderDto }>()
  );
  
  export const submitOrderSuccess = createAction(
    '[Order] Submit Order Success',
    props<{ cartId: number }>()
  );
  
  export const submitOrderFailure = createAction(
    '[Order] Submit Order Failure',
    props<{ error: any }>()
  );