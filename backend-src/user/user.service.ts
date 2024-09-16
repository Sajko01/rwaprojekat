import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dtoc';
import { Observable, from } from 'rxjs';

//izbrisi na kraju dtoc

@Injectable()export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Observable<User> {
    const user = this.userRepository.create(createUserDto);
    return from(this.userRepository.save(user));
  }

  getAllUsers(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  getUser(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id: id } }));
  }

  updateUser(id: number, user: User): Observable<UpdateResult> {
    return from(this.userRepository.update(id, user));
  }

  deleteUser(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete(id));
  }
}