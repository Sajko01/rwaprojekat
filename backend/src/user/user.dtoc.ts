import { UserRole } from "./user.entity";


export class CreateUserDto{
    id: number;
    nick?: string;
    email?: string;
    address?:string;
    password?: string;
    role?:UserRole
}
