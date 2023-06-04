import { All, Controller, Body } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private prismaService: PrismaService) {}
  @All()
  async index(@Body() payload: any) {
    if (payload.type === 'checkout.session.completed') {
      console.log('Evento de pagamento bem-sucedido');
      const paymentId = payload.data.object.id;
      await this.prismaService.booking.update({
        where: {
          paymentID: paymentId,
        },
        data: {
          status: 'Confirmed',
        },
      });
    } else if (payload.type === 'payment_intent.payment_failed') {
      // O evento é um pagamento falhado
      console.log('Evento de pagamento falhado');
      // Faça a lógica adicional para tratar o pagamento falhado
    }
  }
}
