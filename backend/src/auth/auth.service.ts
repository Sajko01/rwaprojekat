import * as jwt from 'jsonwebtoken';
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthPayloadDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
 private readonly JWT_SECRET: string;

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET'); 
  }
 
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(email, password);
    if (user) {
      return user;
    }
    return null; 
  }

  async login(authDto: AuthPayloadDto): Promise<any> {
    const user = await this.validateUser(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException('Nevalidan korisnik!');
    }
    
    const payload = { email: user.email, sub: user.id ,role:user.role};
  
    return {
      access_token: this.jwtService.sign(payload),
      email: authDto.email,
      role:user.role,
      cartId:user.carts[0].id,
      
    };
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, { secret: this.JWT_SECRET });
    } catch (e) {
      throw new UnauthorizedException('Nevalidan token');
    }
  }
}
