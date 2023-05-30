import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { StripeService } from 'src/services/stripe.service';
import { CreateBookingDto } from 'src/validators/Booking.dtos';

type IJWT = {
  data: string;
};

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(
    private stripeService: StripeService,
    private prismaService: PrismaService,
    private jwt: JWTService,
  ) {}
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria reserva',
    description: 'Rota para criar reserva.',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token de acesso',
    required: true,
    example: 'token <token>',
  })
  async createBooking(
    @Body() data: CreateBookingDto,
    @Headers() headers: Record<string, string>,
  ) {
    const { checkinDate, name, numberOfGuests, roomId, days } = data;
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (room.availability != null && room.availability != 'Unavailable') {
      const url = await this.stripeService.criarLinkDePagamento('ghhhhjj', 100);
      const token = <IJWT>this.jwt.decode(headers.token);
    } else {
      throw new HttpException(
        'Não é possível reservar esse quarto',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
