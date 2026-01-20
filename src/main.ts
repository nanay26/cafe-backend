import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common'; // Tambahkan import ini
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- AKTIFKAN VALIDASI GLOBAL (UNTUK ANTI-XSS) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus data yang tidak ada di DTO
      transform: true, // Mengonversi tipe data secara otomatis
      forbidNonWhitelisted: true, // Memberikan error jika ada field asing
    }),
  );

  // Ambil port dari env atau gunakan 3001 sebagai default
  const port = process.env.PORT || 8000;

  // Mendukung akses file statis
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });

  // Konfigurasi CORS
  app.enableCors({
    origin: [
      'https://tersenyum-coffe.vercel.app', // URL Vercel kamu
      'http://localhost:3000', // Tetap izinkan localhost untuk testing
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, ngrok-skip-browser-warning',
  });

  // Gunakan variabel 'port' di sini
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server: http://localhost:${port}`);
  console.log(`🖼️  Folder Uploads: http://localhost:${port}/public/uploads/`);
}

void bootstrap();
