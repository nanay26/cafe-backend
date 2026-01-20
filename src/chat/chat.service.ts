import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private groq = new Groq({
    apiKey: process.env.GROCK_API_KEY, // Mengambil dari variabel .env
  });

  async getAiResponse(userPrompt: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'Kamu adalah Barista Digital TS KOPI. Jawab ramah dan sangat singkat.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const aiResponse = String(
        completion.choices[0]?.message?.content || 'Maaf kak, lagi sibuk.',
      );

      return {
        status: 'success',
        text: aiResponse,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('ERROR GROQ:', errorMessage);

      return {
        status: 'error',
        text: 'Waduh, koneksi ke barista lagi putus kak.',
      };
    }
  }
}
