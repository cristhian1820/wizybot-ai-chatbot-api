import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { ChatbotController } from './controllers/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';

@Module({
  imports: [ProductsModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
