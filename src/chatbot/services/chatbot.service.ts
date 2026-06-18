import { Injectable } from '@nestjs/common';

import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class ChatbotService {
  constructor(private readonly productsService: ProductsService) {}

  chat(message: string): string {
    const products = this.productsService.searchProducts(message);

    return JSON.stringify(products, null, 2);
  }
}
