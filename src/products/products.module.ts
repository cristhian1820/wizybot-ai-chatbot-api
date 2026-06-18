import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';

@Module({
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
