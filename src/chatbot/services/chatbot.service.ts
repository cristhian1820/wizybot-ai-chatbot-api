import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  chat(message: string): string {
    return `Received message: ${message}`;
  }
}
