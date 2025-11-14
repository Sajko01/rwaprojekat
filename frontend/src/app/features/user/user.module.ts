import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { UserComponent } from './components/user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    FormsModule,
  ],
  exports: [
   UserComponent,
  ]
})
export class UsersModule { }