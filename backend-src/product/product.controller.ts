import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dtoc';
import { Observable } from 'rxjs';



import { DeleteResult, UpdateResult } from 'typeorm';
@Controller('product')export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Body() product: CreateProductDto): Observable<Product> {
    return this.productService.create(product);
  }

  @Get()
  getAll(): Observable<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: number): Observable<Product> {
    return this.productService.getProduct(id);
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() product: Product,
  ): Observable<UpdateResult> {
    return this.productService.updateProduct(id, product);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number): Observable<DeleteResult> {
    return this.productService.deleteProduct(id);
  }
}