import { Component } from '@angular/core';
import { Service } from '../interfaces/service';
import { HttpClient } from '@angular/common/http';
import {  forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../auth/auth.state';
import { selectIsLoggedIn, selectUserCartId, selectUserNick, selectUserRole } from '../../../auth/auth.selectors';
import { CartService } from '../../cart/services/cart.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../dialog/service-dialog.component';
import { ServiceService } from '../services/service.service';
import { DialogComponent } from '../../products/dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addToCart, createService, deleteCartItems, deleteService, loadServices, updatePrice } from '../state/services.actions';
import { selectAllServices } from '../state/services.selectors';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

 servicesInCart: { [key: number]: boolean } = {};

 tempQuantities: { [key: number]: number } = {};
  tempPrices: { [key: number]: number } = {};

 isLoggedIn$: Observable<boolean>;
 userNick$: Observable<string | undefined>; 
 userRole$: Observable<string | undefined>; 
 userCartId$: Observable<number | undefined>;
 services$: Observable<Service[]>;

 serviceForm: FormGroup;
 selectedImage: File | null = null;

 isHovering = false;

 constructor(private store: Store<AuthState>,
  private http: HttpClient,
  private cartService:CartService,
  private serviceService:ServiceService,
  private router: Router,
  private dialog:MatDialog,
  private fb: FormBuilder,) {
   this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
   this.userNick$ = this.store.select(selectUserNick); 
   this.userRole$ = this.store.select(selectUserRole);
   this.userCartId$=this.store.select(selectUserCartId);
   this.services$=this.store.select(selectAllServices);

   this.serviceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    pricePerUnit: ['', [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required]],
    image: [null, Validators.required],
  });
 }


 openServiceDialog(serviceDescription: string,serviceName:string): void {
  const dialogRef = this.dialog.open(ServiceDialogComponent, {
    data: { description: serviceDescription ,
            name:serviceName
    },
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dijalog zatvoren');
  });
}

 



deleteCartItems(serviceId: number) {
  this.userCartId$
    .pipe(
      
      switchMap((cartId) => {
        if (cartId) {
          this.store.dispatch(deleteCartItems({ cartId, serviceId }));
          return of(serviceId); 
        } else {
          return of(null); 
        }
      })
    )
    .subscribe({
      next: (response) => {
        if (response) {
          console.log('Uspešno obrisana usluga sa id-jem:', response);
        } else {
          console.error('Nema stavki za brisanje ili korpa nije pronađena');
        }
      },
      error: (err) => {
        console.error('Greška prilikom brisanja:', err); 
      }
    });

  this.servicesInCart[serviceId] = false;
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


addToCart(service: any) {
  this.userCartId$.subscribe((cartId) => {
    if (cartId) {
      const quantityToAdd = this.tempQuantities[service.id];
      const cartItem = {
        cartId: cartId,
        serviceId: service.id,
        quantity: quantityToAdd,
      };
      this.store.dispatch(addToCart({ cartItem }));
      this.servicesInCart[service.id] = true;
  
    }
  });
}


  scrollToServices() {
    const element = document.getElementById('services-section');
    if (element) {
      const yOffset = -70; 
      const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: 'smooth' });
    }
  }



  images: string[] = [
    '/assets/dvorista4.png',
    '/assets/dvorista5.png',
    '/assets/dvorista6.png'
  ];
  currentImage: string="";
  currentIndex: number = 0;

  ngOnInit() {
    this.loadServices();

    this.currentImage = this.images[this.currentIndex];
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentIndex];
    }, 5000); 
  }
  

  getImageUrl(imagePath: string): string {
    return `http://localhost:3000/img/${imagePath}`;
  }


  loadServices(): void {
  this.store.dispatch(loadServices());
  this.services$ = this.store.select(selectAllServices);

  this.services$.subscribe(services => {
    services.forEach(service => {
      this.tempQuantities[service.id] = service.quantityToAdd || 1;
      this.tempPrices[service.id] = service.newPrice || 1;
    });

    this.userCartId$.pipe(
      switchMap(cartId => {
        if (!cartId) return of([]);
        return forkJoin(
          services.map(service =>
            this.cartService.isServiceInCart(cartId, service.id).pipe(
              map(exists => ({ id: service.id, exists }))
            )
          )
        );
      })
    ).subscribe(results => {
      results.forEach(r => {
        this.servicesInCart[r.id] = r.exists;
      });
    });
  });
}

  


  updatePrice(serviceId: number, newPrice: number | undefined): void {
    if (newPrice !== undefined) {
      this.store.dispatch(updatePrice({ serviceId, newPrice }));
    } else {
      console.log('Cena nije validna.');
    }
  }


  openConfirmDialog(serviceId:number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { name: 'Potvrda brisanja', description: 'Da li ste sigurni da želite da obrišete ovu uslugu?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteService(serviceId);
      }
    });
  }



  deleteService(id: number): void {
    this.store.dispatch(deleteService({ id }));
  }



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      this.serviceForm.patchValue({ image: file });
      this.serviceForm.get('image')?.updateValueAndValidity();
    } else {
      console.error('Pogrešan format fajla, očekuje se slika.');
      this.serviceForm.patchValue({ image: null });
    }
  }

  onSubmit(): void {
    if (this.serviceForm.valid && this.selectedImage) {
      const createServiceDto: Service = {
        id: 0, 
        name: this.serviceForm.value.name,
        pricePerUnit: this.serviceForm.value.pricePerUnit,
        description: this.serviceForm.value.description,
        image: '', 
      };

      this.store.dispatch(createService({ service: createServiceDto, image: this.selectedImage }));
    } else {
      console.log('Forma nije validna');
    }
  }


}



