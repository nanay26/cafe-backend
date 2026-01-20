import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminService {
  /**
   * Validasi kredensial admin
   */
  async validateAdmin(username: string, pass: string) {
    const ADMIN_USER = 'admin_tskopi';
    const ADMIN_PASS = 'kopimantap';

    if (username === ADMIN_USER && pass === ADMIN_PASS) {
      return {
        success: true,
        message: 'Login Berhasil',
        isAdmin: true,
        username: ADMIN_USER,
      };
    }

    throw new UnauthorizedException('Username atau Password Salah');
  }

  /**
   * Logika logout
   */
  async logout() {
    return {
      success: true,
      message: 'Berhasil keluar',
    };
  }
}
