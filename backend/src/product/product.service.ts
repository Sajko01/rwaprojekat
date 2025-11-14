import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, LessThan, Repository, UpdateResult } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dtoc';
import { Observable, from, throwError } from 'rxjs';


@Injectable()export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  
  create(createProductDto: CreateProductDto): Observable<Product> { 
    const price = Number(createProductDto.price);
    const quantity = Number(createProductDto.quantity);
    if (price < 0) {
        return throwError(() => new Error('Cena ne može biti negativna!'));
    }

    if (quantity < 0 || !Number.isInteger(quantity)) {
        return throwError(() => new Error('Količina ne može biti negativna ili neinteger: ' + quantity));
    }

    const product = this.productRepository.create({ ...createProductDto, price, quantity }); 
    return from(this.productRepository.save(product));
}

  

  getAllProducts(): Observable<Product[]> {
    return from(this.productRepository.find());
  }

  getProduct(id: number): Observable<Product> {
    return from(this.productRepository.findOne({ where: { id: id } }));
  }



  getProductsByMaxPrice(maxPrice: number): Observable<Product[]> {
    return from(this.productRepository.find({
      where: {
        price: LessThan(maxPrice), 
      },
    }));
  }
  

  updateProduct(id: number, product: Product): Observable<UpdateResult> {
    return from(this.productRepository.update(id, product));
  }

  deleteProduct(id: number): Observable<DeleteResult> {
    return from(this.productRepository.delete(id));
  }

  async updateProductQuantity(id: number, quantity: number): Promise<UpdateResult> {
    
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error('Proizvod nije pronađen!');
    }

    
    return this.productRepository.update(id, { quantity });
  }

  async updateProductPrice(id: number, price: number): Promise<UpdateResult> {
    
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error('Proizvod nije pronađen!');
    }

    
    return this.productRepository.update(id, { price });
  }

  
}

