import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelController } from './controllers/hotel/hotel.controller';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, HotelController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
