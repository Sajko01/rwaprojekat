import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './service.dtoc';
import { Observable, from, throwError } from 'rxjs';
@Injectable()export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  
  create(createServiceDto: CreateServiceDto): Observable<Service> {

    const pricePerUnit = Number(createServiceDto.pricePerUnit);
  
    if (pricePerUnit <= 0) {
      return throwError(() => new Error('Cena mora biti pozitivna!'));
    }
  
    const service = this.serviceRepository.create({...createServiceDto,pricePerUnit});
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

  async updateServicePrice(id: number, pricePerUnit: number): Promise<UpdateResult> {

    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error('Usluga nije pronađena!');
    }

    return this.serviceRepository.update(id, { pricePerUnit });
  }
}