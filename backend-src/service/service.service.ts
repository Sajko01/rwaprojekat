import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './service.dtoc';
import { Observable, from } from 'rxjs';
@Injectable()export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  create(createServiceDto: CreateServiceDto): Observable<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    return from(this.serviceRepository.save(service));
  }

  getAllServices(): Observable<Service[]> {
    return from(this.serviceRepository.find());
  }

  getService(id: number): Observable<Service> {
    return from(this.serviceRepository.findOne({ where: { id: id } }));
  }

  updateService(id: number, service: Service): Observable<UpdateResult> {
    return from(this.serviceRepository.update(id, service));
  }

  deleteService(id: number): Observable<DeleteResult> {
    return from(this.serviceRepository.delete(id));
  }
}