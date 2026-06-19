import { Module } from '@nestjs/common';

import { CurrencyModule } from '../currency/currency.module';
import { ProductsModule } from '../products/products.module';
import { OpenAiService } from './services/openai.service';

@Module({
  imports: [ProductsModule, CurrencyModule],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenaiModule {}
