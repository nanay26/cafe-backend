import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check')
  checkAuth(@Req() req: Request) {
    return this.authService.validateSession(req);
  }
}
