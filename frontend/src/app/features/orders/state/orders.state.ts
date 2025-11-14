
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OrderDto } from "../interfaces/order";

export interface OrderState extends EntityState<OrderDto> {
  orderMade: boolean;
  loading: boolean;
  error: string | null;
}

export const orderAdapter: EntityAdapter<OrderDto> = createEntityAdapter<OrderDto>();

export const initialState: OrderState = orderAdapter.getInitialState({
  loading: false,
  orderMade: false,
  error: null,
});
