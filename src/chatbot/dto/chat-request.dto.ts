import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    example: 'I am looking for a phone',
    description: 'User enquiry sent to the chatbot',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
