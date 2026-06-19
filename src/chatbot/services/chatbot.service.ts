import { Injectable } from '@nestjs/common';

import { OpenAiService } from '../../openai/services/openai.service';

@Injectable()
export class ChatbotService {
  constructor(private readonly openAiService: OpenAiService) {}

  async chat(message: string): Promise<string> {
    return this.openAiService.generateResponse(message);
  }
}
