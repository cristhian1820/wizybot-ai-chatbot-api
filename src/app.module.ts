import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ChatbotModule } from './chatbot/chatbot.module';
import { ProductsModule } from './products/products.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatbotModule,
    ProductsModule,
    CurrencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
