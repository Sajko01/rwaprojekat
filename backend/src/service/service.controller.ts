import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Service } from './service.entity';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './service.dtoc';
import { catchError, from, Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { UserRole } from 'src/user/user.entity';
import { Roles } from 'src/role/roles.decorator';
@Controller('service')export class ServiceController {
  constructor(private serviceService: ServiceService) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor('image', 1,{ 
      storage: diskStorage({
        destination: (req, file, cb) => {
          const isImage = file.mimetype.startsWith('image/');
          if (isImage) {
            cb(null, 'public/img');
          } else {
            cb(new Error('Nevalidan tip fajla!'), null);
          }
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isImage = file.mimetype.startsWith('image/');
        if (isImage) {
          cb(null, true);
        } else {
          cb(new Error('Nevalidan tip fajla!'), false);
        }
      },
    }),
  )
  create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Observable<Service> {
    if (files && files.length > 0) {
      createServiceDto.image = `${files[0].originalname}`;
    } else {
      throw new BadRequestException('Potreban fajl slike!');
    }

    return from(this.serviceService.create(createServiceDto)).pipe(
      catchError((error) => {
        console.error('Error creating service:', error);
        throw error;
      }),
    );
  }



  @Get()
  getAll(): Observable<Service[]> {
    return this.serviceService.getAllServices();
  }

  @Get(':id')
  getService(@Param('id') id: number): Observable<Service> {
    return this.serviceService.getService(id);
  }

  @Put(':id')
  updateService(
    @Param('id') id: number,
    @Body() service: Service,
  ): Observable<UpdateResult> {
    return this.serviceService.updateService(id, service);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteService(@Param('id') id: number): Observable<DeleteResult> {
    return this.serviceService.deleteService(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(UserRole.ADMIN)
  @Put(':id/price')
  async updateServicePrice(
    @Param('id') id: number,
    @Body('pricePerUnit') pricePerUnit: number,
  ): Promise<UpdateResult> {
    return this.serviceService.updateServicePrice(id, pricePerUnit);
  }
}