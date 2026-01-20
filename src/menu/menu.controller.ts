import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put, // Tambahkan ini
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MenuService, UpdateMenuDto } from './menu.service';

interface CreateMenuDto {
  name: string;
  price: string;
  description: string;
  category: string;
}

@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    // Memanggil logika RAG di service
    return this.menuService.getChatResponse(message);
  }
  // --- FUNGSI UPDATE (INI YANG KURANG) ---
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMenuDto,
  ) {
    const updateData: UpdateMenuDto = {
      name: body.name,
      price: parseFloat(body.price),
      description: body.description,
      category: body.category,
    };

    if (file) {
      updateData.image = `/uploads/${file.filename}`;
    }

    // Sekarang argumen ini aman (Safe Argument)
    return this.menuService.updateMenu(id, updateData);
  }
  // --- FUNGSI CREATE ---
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMenuDto,
  ) {
    return this.menuService.createMenu({
      name: body.name,
      price: parseFloat(body.price),
      description: body.description,
      category: body.category,
      image: `/uploads/${file.filename}`,
    });
  }

  @Get()
  async findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
