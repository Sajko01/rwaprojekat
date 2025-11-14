
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../interfaces/product';

export interface ProductState extends EntityState<Product> {
  loading: boolean;
  error: string | null;
  productsInCart: Product[];
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialState: ProductState = adapter.getInitialState({
  loading: false,
  error: null,
  productsInCart: [],
});
