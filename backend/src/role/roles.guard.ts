import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decorator';
  import { User } from 'src/user/user.entity';
  import { UserRole } from 'src/user/user.entity';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true; 
      }
      const { user }: { user: User } = context.switchToHttp().getRequest();
    console.log('Potrebna uloga:', requiredRoles); 
      return requiredRoles.some((role) => user.role === role);
    }
  }

