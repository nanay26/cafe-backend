import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService], // Opsional: agar bisa dipakai module lain jika perlu
})
export class AdminModule {}
