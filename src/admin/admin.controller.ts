import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';

// Interface untuk validasi tipe data (Menghilangkan error ESLint any)
interface LoginDto {
  username: string;
  password: string;
}

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Endpoint: POST https://.../api/admin/login
   */
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.adminService.validateAdmin(body.username, body.password);
  }

  /**
   * Endpoint: POST https://.../api/admin/logout
   */
  @Post('logout')
  async logout() {
    return this.adminService.logout();
  }

  /**
   * Endpoint: GET https://.../api/admin/session
   */
  @Get('session')
  async checkSession() {
    // Sementara return true agar frontend dapat memverifikasi status
    return { isAdmin: true };
  }
}
