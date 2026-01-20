import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // Import default tanpa asterisk (*)
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- AKTIFKAN COOKIE PARSER ---
  // Sekarang ini bisa dipanggil karena import menggunakan default import
  app.use(cookieParser());

  // --- AKTIFKAN VALIDASI GLOBAL (UNTUK ANTI-XSS) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus data yang tidak ada di DTO
      transform: true, // Mengonversi tipe data secara otomatis
      forbidNonWhitelisted: true, // Memberikan error jika ada field asing
    }),
  );

  // Ambil port dari env atau gunakan 8000 sebagai default
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
    credentials: true, // PENTING: Agar cookie bisa terkirim antar domain
    allowedHeaders: 'Content-Type, Accept, ngrok-skip-browser-warning',
  });

  // Jalankan server
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server: http://localhost:${port}`);
  console.log(`🖼️  Folder Uploads: http://localhost:${port}/public/uploads/`);
}

void bootstrap();
