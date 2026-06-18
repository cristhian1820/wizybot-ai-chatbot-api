import { Module } from '@nestjs/common';
import { CurrencyService } from './services/currency.service';

@Module({
  providers: [CurrencyService]
})
export class CurrencyModule {}
