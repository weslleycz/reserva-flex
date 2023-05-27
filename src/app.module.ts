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
import { isAdm, log } from './middlewares';
import { UserController } from './controllers/user/user.controller';
import { GridFsService } from './services/gridfs.service';
import { BcryptService } from './services/bcrypt.service';
import { JWTService } from './services/jwt.service';

@Module({
  imports: [],
  controllers: [AppController, HotelController, RoomController, UserController],
  providers: [
    AppService,
    PrismaService,
    GridFsService,
    BcryptService,
    JWTService,
  ],
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
    consumer.apply(log).forRoutes('*');
  }
}
