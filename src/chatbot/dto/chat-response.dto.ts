import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty({
    example: 'I found two phone options for you...',
    description: 'Final chatbot response',
  })
  response!: string;
}
