
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Service } from "../interfaces/service";

export const serviceAdapter: EntityAdapter<Service> = createEntityAdapter<Service>();

export interface ServiceState extends EntityState<Service> {
  loading: boolean;
  error: string | null;
  servicesInCart: Service[];
}


export const initialState: ServiceState = serviceAdapter.getInitialState({
  loading: false,
  error: null,
  servicesInCart: [],
});
