import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ChatbotService } from '../services/chatbot.service';
import { ChatRequestDto } from '../dto/chat-request.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';
@ApiTags('Chatbot')
@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a user enquiry to the chatbot',
  })
  @ApiBody({ type: ChatRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Final chatbot response',
    type: ChatResponseDto,
  })
  chat(@Body() request: ChatRequestDto): ChatResponseDto {
    const response = this.chatbotService.chat(request.message);

    return { response };
  }
}
