import { Module } from '@nestjs/common';

import { OpenaiModule } from '../openai/openai.module';
import { ChatbotController } from './controllers/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';

@Module({
  imports: [OpenaiModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
