import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Service } from './service.entity';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './service.dtoc';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
@Controller('service')export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Post()
  create(@Body() service: CreateServiceDto): Observable<Service> {
    return this.serviceService.create(service);
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

  @Delete(':id')
  deleteService(@Param('id') id: number): Observable<DeleteResult> {
    return this.serviceService.deleteService(id);
  }
}