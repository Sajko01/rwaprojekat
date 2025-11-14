import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from '../interfaces/product';
import { selectIsLoggedIn, selectUserCartId, selectUserNick, selectUserRole } from '../../../auth/auth.selectors';
import { AuthState } from '../../../auth/auth.state';
import { Store } from '@ngrx/store';
import {  BehaviorSubject, combineLatest, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { CartService } from '../../cart/services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { DialogComponent } from '../dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectAllProducts, selectProductsError, selectProductsLoading } from '../state/products.selectors';
import { addProductToCart, createProduct, deleteProduct, deleteProductFromCart, loadProducts,  updateProductPrice, updateProductQuantity } from '../state/products.actions';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

productsWithCart$: Observable<Product[]> = of([]);


           
  productsInCart: { [key: number]: boolean } = {}; 
  quantityToAdd: { [key: number]: number } = {};

  selectedType$ = new BehaviorSubject<string>('');
searchTerm$ = new BehaviorSubject<string>('');

  isLoggedIn$: Observable<boolean>;
  userNick$: Observable<string | undefined>; 
  userRole$: Observable<string | undefined>; 
  userCartId$: Observable<number | undefined>;

 productForm: FormGroup;
  selectedImage: File | null = null;

  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  filteredProducts$: Observable<Product[]> | null = null;

  tempQuantities: { [key: number]: number } = {};
  tempPrices: { [key: number]: number } = {};
  tempQuantitiesUser: { [key: number]: number } = {};



loadProducts(): void {
  this.store.dispatch(loadProducts());
  this.products$ = this.store.select(selectAllProducts);

  this.products$.subscribe(products => {
    products.forEach(product => {
      this.tempQuantities[product.id] = product.quantityToAdd || 1;
      this.tempPrices[product.id] = product.newPrice || 1;
    });

  
    this.userCartId$.pipe(
      switchMap(cartId => {
        if (!cartId) return of([]);
        return this.cartService.getProductsInCart(cartId); 
      })
    ).subscribe(productsInCart => {
      productsInCart.forEach(p => this.productsInCart[p.id] = true);
    });
  });

  this.filteredProducts$ = combineLatest([
    this.products$,
    this.selectedType$,
    this.searchTerm$
  ]).pipe(
    map(([products, selectedType, searchTerm]) =>
      products.filter(product =>
        (selectedType ? product.type === selectedType : true) &&
        (searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      )
    )
  );
}



  constructor(private store: Store<AuthState>,
    private http: HttpClient,
    private cartService:CartService,
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog,
    private fb: FormBuilder) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userNick$ = this.store.select(selectUserNick); 
    this.userRole$ = this.store.select(selectUserRole);

    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
    this.userCartId$=this.store.select(selectUserCartId);

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      type: ['', [Validators.required, Validators.minLength(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      image: ['', Validators.required],
    });
  }



  ngOnInit(): void {
    this.loadProducts();

  }





  get uniqueTypes$(): Observable<string[]> {
    return this.products$.pipe(
      map(products => Array.from(new Set(products.map(product => product.type))))
    );
  }
  



  deleteCartItems(productId: number) {
    this.userCartId$
      .pipe(
    
        switchMap((cartId) => {
          if (cartId) {
            
            this.store.dispatch(deleteProductFromCart({ cartId, productId }));
            return of(productId); 
          } else {
            return of(null); 
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
          } else {
            console.log('Nema stavki za brisanje ili cartId nije dostupan!');
          }
        },
        error: (err) => {
          console.error('Greška prilikom brisanja:', err);
        },
      });
      this.productsInCart[productId] =false;

  }

 


  addToCart(product: any) {
    this.userCartId$.subscribe((cartId) => {
      if (cartId) {
        const quantityToAdd = this.tempQuantities[product.id];
        const cartItem = {
          cartId: cartId,
          productId: product.id,
          quantity: quantityToAdd
        };

        this.store.dispatch(addProductToCart({ cartItem }));
      }
    });
    this.productsInCart[product.id] = true;

  }
 



 

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToProducts() {
    const element = document.getElementById('products-section');
    if (element) {
      const yOffset = -70; 
      const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: 'smooth' });
    }
  }

  scrollToUsers() {

    this.router.navigate(['/user']).then(() => {
      setTimeout(() => {
        const element = document.getElementById('user-section');
        if (element) {
          const yOffset = 0; 
          const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: yPosition, behavior: 'smooth' });
        }
      }, 200); 
    });
  }
  
  

  getImageUrl(imagePath: string): string {
    return `http://localhost:3000/img/${imagePath}`;
  }

 


  updateQuantity(productId: number, newQuantity: number | undefined): void {
    if (newQuantity !== undefined) {
      this.store.dispatch(
        updateProductQuantity({ productId, quantity: newQuantity })
      );
    }
  }
  
updatePrice(productId: number, newPrice: number | undefined): void {
  if (newPrice !== undefined) {
    this.store.dispatch(updateProductPrice({ productId, newPrice }));
  }
}



  openConfirmDialog(productId:number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { name: 'Potvrda brisanja', description: 'Da li ste sigurni da želite da obrišete ovaj proizvod?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(productId);
      }
    });
  }

  deleteProduct(id: number): void {
    this.store.dispatch(deleteProduct({ id }));
  }
  
 


  onFileSelected(event: any): void {
    const file = event.target.files[0]; 
  
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file; 
      this.productForm.patchValue({
        image: file
      });
      this.productForm.get('image')?.updateValueAndValidity(); 
    } else {
      console.error('Pogrešan format fajla, očekuje se slika!');
      this.productForm.patchValue({
        image: null
      });
    }

   
    console.log('Selektovana slika:', this.selectedImage);
  }
  
  

  onSubmit(): void {
    if (this.productForm.value.quantity < 0 || !Number.isInteger(this.productForm.value.quantity)) {
      alert('Količina mora biti pozitivan ceo broj!');
      return;
  }
    if (this.productForm.valid && this.selectedImage) {
      const createProductDto:Product= {
        id: 0, 
        name: this.productForm.value.name,
        type: this.productForm.value.type,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        image: '',
      };

      
      this.store.dispatch(createProduct({ product: createProductDto, image: this.selectedImage }));
    }
    else{
      console.log('Forma nije validna');
    Object.keys(this.productForm.controls).forEach(key => {
      const controlErrors = this.productForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`Greške u ${key}:`, controlErrors);
      }
    });
  

    }
  }



}

