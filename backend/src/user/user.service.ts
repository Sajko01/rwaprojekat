import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dtoc';
import { Observable, from } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService 
  ) {}


  create(createUserDto: CreateUserDto): Observable<User> {
    return from(this.registerUser(createUserDto)); 
  }


  private async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    return this.userRepository.save(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<any> { 
    const user = await this.userRepository.findOne({ where: { email },relations: ['carts'], });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; 
      return result;
    }
    return null;
  }

  async login(authDto: AuthPayloadDto): Promise<any> {

    return this.authService.login(authDto);  
   
  }
  


   

  
  












//izbrisi na kraju dtoc

// @Injectable()export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   create(createUserDto: CreateUserDto): Observable<User> {//moze i from umesto defer za pretvaranje primisea u observable

//     return defer(async () => {
//       const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
//       createUserDto.password = hashedPassword;
//       const savedUser = await this.userRepository.save(createUserDto);
//       return savedUser;
//     });
//     // const user = this.userRepository.create(createUserDto);
//     // return from(this.userRepository.save(user));
//   }

  getAllUsers(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  getUser(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id: id } }));
  }

  // getUserByUsername(username: string): Observable<User> {
  //     return from(this.userRepository.findOne({ where: { email: username } }));
  // }

  updateUser(id: number, user: User): Observable<UpdateResult> {
    return from(this.userRepository.update(id, user));
  }

  deleteUser(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete(id));
  }
}