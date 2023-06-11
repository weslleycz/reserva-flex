import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Injectable()
export class CronService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  private readonly logger = new Logger(CronService.name);

  scheduleTasks() {
    // Exemplo: agendando uma tarefa para ser executada a cada minuto
    cron.schedule('* * * * *', async () => {
      this.checkPendingPaymentOverdue();
    });
  }
  async checkPendingPaymentOverdue() {
    this.logger.debug('Verificar o status do pagamento e a data de vencimento');
    const test = await this.redisService.getValue('test');
    console.log(test);
    const pending = await this.prismaService.booking.findMany({
      where: {
        status: 'Pending',
        paymentTerm: {
          lte: new Date().toISOString(),
        },
      },
      include: {
        user: true,
        room: true,
      },
    });
    pending.map(async (booking) => {
      await this.prismaService.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: 'Cancelada',
        },
      });
      await this.prismaService.room.update({
        where: {
          id: booking.roomId,
        },
        data: {
          availability: 'Available',
        },
      });
    });
  }
}
