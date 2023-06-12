import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Injectable()
export class CronService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}
  private readonly logger = new Logger(CronService.name);

  scheduleTasks() {
    cron.schedule('* * * * *', async () => {
      this.checkPendingPaymentOverdue();
    });
  }

  scheduleTasksAtTwelveOclock() {
    cron.schedule('0 10 * * *', async () => {
      this.checkAndNotifyLastDayOfReservation();
    });
  }

  async checkPendingPaymentOverdue() {
    this.logger.debug('Verificar o status do pagamento e a data de vencimento');
    const pending = await this.prismaService.booking.findMany({
      where: {
        status: 'Pending',
        paymentTerm: {
          lte: new Date().toString(),
        },
      },
      include: {
        user: true,
        room: true,
      },
    });
    pending.map(async (booking) => {
      const bookingBd = await this.prismaService.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: 'Cancelada',
        },
      });
      await this.redisService.setValue(
        bookingBd.userId,
        JSON.stringify({
          title: 'Status da reserva',
          message: 'Reserva cancelada por falta de pagamento',
          type: 'danger',
        }),
      );
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

  async checkAndNotifyLastDayOfReservation() {
    this.logger.debug('Verificar se o trmpo de estadia terminou');
    const bookings = await this.prismaService.booking.findMany({
      where: {
        checkoutDate: {
          lte: new Date().toString(),
        },
        status: 'Check',
      },
    });
    bookings.map(async (booking) => {
      this.redisService.setValue(
        booking.userId,
        JSON.stringify({
          title: 'Status da reserva',
          message:
            'Seu tempo de estadia terminou. Agradecemos por sua preferência.',
          type: 'info',
        }),
      );
    });
  }
}
