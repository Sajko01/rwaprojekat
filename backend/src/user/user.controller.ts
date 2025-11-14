import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthPayloadDto } from 'src/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';


@Controller('user')export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  registerUser(@Body() user: CreateUserDto): Observable<User> {
    if (!user.role) {
      user.role = UserRole.USER; 
     
  }
    return this.userService.create(user);
  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() authDto: AuthPayloadDto): Promise<any> {
    return this.userService.login(authDto);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin-only')
  adminOnlyRoute() {
    return 'Ovo je ruta samo za admin korisnike!';
  }

  @Get()
  getAll(): Observable<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number): Observable<User> {
    return this.userService.getUser(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<UpdateResult> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.deleteUser(id);
  }
}