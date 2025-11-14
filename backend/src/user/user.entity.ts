import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/order.entity';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';


export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
  }

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nick: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;
  

    @Column()
    address: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    @Length(8) 
    @Matches(/^(?=.*\d).+$/, { 
        message: 'Lozinka mora sadržati bar jedan broj!',
    })
    password: string;



    @Column({ 
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
      })
      role: UserRole;
    
    @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
    carts: Cart[];

    @OneToMany(() => Order, (order) => order.user, { cascade: true })
    orders: Order[];
  
}

