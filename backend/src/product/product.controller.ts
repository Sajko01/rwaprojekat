import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dtoc';
import { catchError, from, Observable } from 'rxjs';
import { diskStorage } from 'multer';



import { DeleteResult, UpdateResult } from 'typeorm';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/role/roles.decorator';
import { UserRole } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
@Controller('product')export class ProductController {
  constructor(private productService: ProductService) {}

 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor('image', 1, { 
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
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
   ): Observable<Product> {
    if (files && files.length > 0) {
      createProductDto.image = `${files[0].originalname}`;
    } else {
      throw new BadRequestException('Potrebna je slika!');
    }

    return from(this.productService.create(createProductDto)).pipe(
      catchError((error) => {
        console.error('Greška pri kreiranju proizvoda:', error);
        throw error;
      })
    );
  }


  @Get()
  getAll(): Observable<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: number): Observable<Product> {
    return this.productService.getProduct(id);
  }
   

  @Get('max-price')
  getProductsByMaxPrice(@Query('price') maxPrice: number): Observable<Product[]> {
    return this.productService.getProductsByMaxPrice(maxPrice);
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() product: Product,
  ): Observable<UpdateResult> {
    return this.productService.updateProduct(id, product);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteProduct(@Param('id') id: number): Observable<DeleteResult> {
    return this.productService.deleteProduct(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/quantity')
  async updateProductQuantity(
    @Param('id') id: number,
    @Body('quantity') quantity: number,
  ): Promise<UpdateResult> {
    return this.productService.updateProductQuantity(id, quantity);
  }



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/price')
  async updateProductPrice(
    @Param('id') id: number,
    @Body('price') price: number,
  ): Promise<UpdateResult> {
    return this.productService.updateProductPrice(id, price);
  }


  
}

