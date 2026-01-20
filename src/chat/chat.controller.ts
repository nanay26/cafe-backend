import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat') // Endpoint: http://localhost:3001/chat
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask') // Endpoint: http://localhost:3001/chat/ask
  async askQuestion(@Body('prompt') prompt: string) {
    return this.chatService.getAiResponse(prompt);
  }
}
