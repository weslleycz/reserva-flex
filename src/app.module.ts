import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelController } from './controllers/hotel/hotel.controller';
import { PrismaService } from './services/prisma.service';
import { RoomController } from './controllers/room/room.controller';
import { isAdm } from './middlewares/adm-guard/adm-guard.middleware';

@Module({
  imports: [],
  controllers: [AppController, HotelController, RoomController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
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
  }
}
