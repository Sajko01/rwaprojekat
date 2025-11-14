// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import {Product} from './product/product.entity';
import { ProductModule } from './product/product.module';
import { ServiceModule } from './service/service.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { CartItemModule } from './cartItem/cartItem.module';
import { Order } from './order/order.entity';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './orderItem/orderItem.module';
import { Service } from './service/service.entity';
import { User } from './user/user.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cartitem/cartItem.entity';
import { OrderItem } from './orderitem/orderitem.entity';
import { Product } from './product/product.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'sajko',
      password: 'sajko123',
      database: 'rwaprojekat1',
      //entities:[Product,Service,User,Cart,CartItem,Order,OrderItem],
      autoLoadEntities: true,
      synchronize: true,
    }),
    //ostali moduli
    ProductModule,
    ServiceModule,
    UserModule,
    CartModule,
    CartItemModule,
    OrderModule,
     OrderItemModule
     
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


//git oBAVEZNO PRE SVEGA RESI BAR NESTOOO!!!!
//image folder
//auth
//kreci servisi i kontroleri, funkcije
//create DTOs
//sta znaci dto= obezbedjuje koje podatke moze preneti ili uzeti klijent, data transfer object za prenos podataka...
//jedna klasa dto ukljucuje sve podatke kad se vracaju ka klijentu, a druga createdto ssamo one kad se kreira entitet
//npr izostavis datum jer se sam kreira i id-ne mora i :user veze...
//kod create dtos je wrapper tip String , a typeORM ocekuje primitivne tipove za kreiranej eniteta,ocekuje string sa malo s



//entities:[Product], a kad dodamo u modulu, poveze entitete preko modula
//nisu hteli svi entiteti od jednom
//sto ima levo veza ima i desno svaka
//eager:true ucitava sve povezane entitete ali pazi da ucita bitno , ne sve
//onDelete cascae brise povezane entitete sa glavnim, manytoone.one je glavni
//module samo za onetomany, veze isto tako u dto samo ono sto je manytoone ima atribut liste ne

//CASCADE KAZE od koga zavisi u tabelama , prema glavnomo odnosno gleda se manyTOOne veza//

//pitanja
//trebale sve veze u forFeatures,

//proveri kako treba funkcionise app

//oncascade resi i eager promisli...    kopiraj sve entitete na bota na kraju krajeva...



