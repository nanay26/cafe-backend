import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthService {
  validateSession(req: Request) {
    // Memberikan tipe data string | undefined secara eksplisit (Type Casting)
    const adminToken = req.cookies?.['admin_token'] as string | undefined;
    const guestToken = req.cookies?.['guest_session'] as string | undefined;

    if (adminToken || guestToken) {
      return {
        active: true,
        role: adminToken ? 'admin' : 'guest',
      };
    }
    return { active: false };
  }
}
