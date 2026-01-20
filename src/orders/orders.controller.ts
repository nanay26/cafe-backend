import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService, AnalyticsResponse } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto/create-order.dto'; // Import DTO untuk proteksi XSS

@Controller('api/orders') // Prefix 'api' sesuai permintaan Anda agar konsisten dengan frontend
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    body: CreateOrderDto, // Menggunakan DTO untuk validasi XSS (Anti-tag HTML)
  ) {
    if (!body.customerName || !body.customerName.trim()) {
      throw new BadRequestException('Customer name is required');
    }
    // Prisma secara default melindungi dari SQL Injection melalui prepared statements
    return this.ordersService.create(body);
  }

  @Get('analytics')
  async getAnalytics(): Promise<AnalyticsResponse> {
    // Menghasilkan data total pendapatan, pesanan, rata-rata, dan persentase pertumbuhan
    return this.ordersService.getAnalytics();
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  // Gunakan PATCH untuk update status (lebih tepat secara REST API)
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    if (!body.status) {
      throw new BadRequestException('Status wajib dikirim');
    }
    return this.ordersService.updateStatus(id, body.status);
  }

  // Endpoint untuk menghapus pesanan
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
