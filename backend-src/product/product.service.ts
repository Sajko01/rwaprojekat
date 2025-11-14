import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dtoc';
import { Observable, from } from 'rxjs';


@Injectable()export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto): Observable<Product> {
    const product = this.productRepository.create(createProductDto);
    return from(this.productRepository.save(product));
  }

  getAllProducts(): Observable<Product[]> {
    return from(this.productRepository.find());
  }

  getProduct(id: number): Observable<Product> {
    return from(this.productRepository.findOne({ where: { id: id } }));
  }

  updateProduct(id: number, product: Product): Observable<UpdateResult> {
    return from(this.productRepository.update(id, product));
  }

  deleteProduct(id: number): Observable<DeleteResult> {
    return from(this.productRepository.delete(id));
  }
}