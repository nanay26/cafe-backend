import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export interface UpdateMenuDto {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  image?: string;
}

@Injectable()
export class MenuService {
  private readonly model: ChatGroq;
  // Kita kelola memori secara manual menggunakan array string sederhana
  // Ini jauh lebih aman dari error "Module Not Found"
  private readonly chatHistories: Map<string, string[]> = new Map();

  constructor(private readonly prisma: PrismaService) {
    this.model = new ChatGroq({
      apiKey: process.env.GROCK_API_KEY,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
    });
  }

  async getChatResponse(userQuery: string, sessionId: string = 'default-user') {
    try {
      // 1. Retrieval: Ambil data menu dari database
      const menus = await this.prisma.menu.findMany();
      const menuContext = menus
        .map(
          (m) => `- ${m.name}: Rp${m.price} (${m.category}). ${m.description}`,
        )
        .join('\n');

      // 2. Memory: Ambil riwayat chat sebelumnya
      const history = this.chatHistories.get(sessionId) || [];
      const historyString = history.join('\n');

      // 3. Prompt: Gabungkan Konteks, Riwayat, dan Pertanyaan
      const template = `Anda adalah "Barista Virtual" yang ramah di Tersenyum Coffee.
      
      INFORMASI OUTLET KAMI:
      - Jam Operasional: 19.00 - 23.59 (Setiap Hari).
      - Fasilitas: WiFi kencang,cocok buat nongkrong, Area Outdoor.
      - Lokasi: Jl. Pekojan, Purwodinatan, Kota Semarang
      
      LOGIKA REKOMENDASI:
      - Jika pelanggan ingin "Less Sugar" atau "Sehat": Sarankan kopi hitam atau menu tanpa susu/sirup dari daftar menu.
      - Jika pelanggan ingin "Segar": Sarankan kategori Non-Coffee atau buah-buahan.
      - Jika pelanggan ingin "Manis/Creamy": Sarankan menu berbasis Latte atau Susu.
      - Selalu tawarkan opsi "Custom" (misal: kurangi gula/es) jika memungkinkan.

      DAFTAR MENU KAMI:
      {context}

      RIWAYAT CHAT:
      {chat_history}

      PERTANYAAN PELANGGAN: {question}
      JAWABAN (Gunakan gaya bahasa santai tapi sopan, panggil "Kak"):`;

      const prompt = PromptTemplate.fromTemplate(template);
      const parser = new StringOutputParser();

      // 4. Chain: Alur kerja AI (Prompt -> Model -> Teks)
      const chain = prompt.pipe(this.model).pipe(parser);

      const reply = await chain.invoke({
        context: menuContext,
        chat_history: historyString,
        question: userQuery,
      });

      // 5. Update Memory: Simpan 6 baris percakapan terakhir
      const newHistory = [
        ...history,
        `User: ${userQuery}`,
        `Bot: ${reply}`,
      ].slice(-6);
      this.chatHistories.set(sessionId, newHistory);

      return { reply };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Chatbot Error:', errorMessage);
      return { reply: 'Maaf kak, Barista sedang sibuk. Bisa tanya lagi?' };
    }
  }

  // --- FUNGSI CRUD (DATABASE) ---

  async createMenu(data: {
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }) {
    return this.prisma.menu.create({ data });
  }

  async updateMenu(id: number, data: UpdateMenuDto) {
    return this.prisma.menu.update({ where: { id }, data });
  }

  async findAll() {
    return this.prisma.menu.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    return this.prisma.menu.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return this.prisma.menu.delete({ where: { id } });
  }
}
