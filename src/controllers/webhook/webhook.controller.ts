import { All, Controller, Body } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { RedisService } from '../../services/redis.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}
  @All()
  async index(@Body() payload: any) {
    if (payload.type === 'checkout.session.completed') {
      console.log('Evento de pagamento bem-sucedido');
      const paymentId = payload.data.object.id;
      const booking = await this.prismaService.booking.update({
        where: {
          paymentID: paymentId,
        },
        data: {
          status: 'Confirmed',
        },
      });
      await this.redisService.setValue(
        booking.userId,
        JSON.stringify({
          title: 'Status do pagamento',
          message: 'Pagamento bem sucedido',
          type: 'success',
        }),
      );
    } else if (payload.type === 'payment_intent.payment_failed') {
      console.log('Evento de pagamento falhado');
      // Faça a lógica adicional para tratar o pagamento falhado
    }
  }
}
