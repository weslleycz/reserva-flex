import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelController } from './controllers/hotel/hotel.controller';
import { PrismaService } from './services/prisma.service';
import { RoomController } from './controllers/room/room.controller';
import { isAdm, log } from './middlewares';
import { UserController } from './controllers/user/user.controller';
import { GridFsService } from './services/gridfs.service';
import { BcryptService } from './services/bcrypt.service';
import { JWTService } from './services/jwt.service';
import { ViewsController } from './controllers/views/views.controller';
import { resolve } from 'path';
import { TsxViewsModule } from 'nestjs-tsx-views';
import { EmailService } from './services/nodemailer.service';
import { jwtGuard } from './middlewares/jwt-guard/jwt-guard.middleware';
import { BookingController } from './controllers/booking/booking.controller';
import { StripeService } from './services/stripe.service';
import { CronService } from './services/cron.service';
import { WebhookController } from './controllers/webhook/webhook.controller';
import { NotificationController } from './controllers/notification/notification.controller';
import { RedisService } from './services/redis.service';

@Module({
  imports: [
    TsxViewsModule.registerAsync({
      useFactory: () => ({
        viewsDirectory: resolve(__dirname, './views'),
        prettify: true,
        exclude: ['/throws-exception'],
        forRoutes: [ViewsController],
      }),
    }),
  ],
  controllers: [
    AppController,
    HotelController,
    RoomController,
    UserController,
    ViewsController,
    BookingController,
    WebhookController,
    NotificationController,
  ],
  providers: [
    AppService,
    PrismaService,
    GridFsService,
    BcryptService,
    JWTService,
    EmailService,
    StripeService,
    CronService,
    RedisService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly cronService: CronService) {
    this.cronService.scheduleTasks();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAdm)
      .forRoutes({ path: 'hotel', method: RequestMethod.POST });
    consumer
      .apply(isAdm)
      .forRoutes({ path: 'hotel', method: RequestMethod.DELETE });
    consumer
      .apply(isAdm)
      .forRoutes({ path: 'hotel', method: RequestMethod.PUT });
    consumer
      .apply(isAdm)
      .forRoutes({ path: 'room/:id', method: RequestMethod.POST });
    consumer.apply(log).forRoutes('*');
    consumer
      .apply(jwtGuard)
      .forRoutes({ path: 'user/uploadAvatar', method: RequestMethod.PUT });
    consumer
      .apply(jwtGuard)
      .forRoutes({ path: 'booking', method: RequestMethod.POST });
    consumer
      .apply(jwtGuard)
      .forRoutes({ path: 'booking', method: RequestMethod.GET });
    consumer
      .apply(jwtGuard)
      .forRoutes({ path: 'booking', method: RequestMethod.DELETE });
  }
}
