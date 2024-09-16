import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

//kad ovo napises database se pokrece, vidimo da li radi! !!!

// import { Injectable, Logger } from '@nestjs/common';
// import { InjectConnection } from '@nestjs/typeorm';
// import { Connection } from 'typeorm';

// @Injectable()
// export class AppService {
//   getHello(): string {
//          return 'Hello World!';
//        }
//   private readonly logger = new Logger(AppService.name);

//   constructor(@InjectConnection() private readonly connection: Connection) {}

//   async onModuleInit() {
//     try {
//       await this.connection.query('SELECT 1'); // Test query
//       this.logger.log('Database connection is successful.');
//     } catch (error) {
//       this.logger.error('Database connection failed.', error.stack);
//     }
//   }

//   getStatus(): string {
//     return 'Application is connected to the database';
//   }
// }
