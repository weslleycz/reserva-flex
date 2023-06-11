import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import moment from 'moment';
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
    const { checkinDate, numberOfGuests, roomId, days } = data;
    const [day, month, year] = checkinDate.split('/');
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (room.availability != null && room.availability != 'Unavailable') {
      const session = await this.stripeService.criarLinkDePagamento(
        room.description,
        room.price,
        days,
      );
      const token = <IJWT>this.jwt.decode(headers.token);
      const checkinDateBD = moment(
        new Date(`${year}-${month}-${day}`),
      ).toString();
      const checkoutDateBD = moment(`${year}-${month}-${day}`)
        .add(days, 'day')
        .toString();
      const paymentTerm = moment(new Date()).add(1, 'day').toString();
      await this.prismaService.booking.create({
        data: {
          checkinDate: checkinDateBD,
          checkoutDate: checkoutDateBD,
          numberOfGuests,
          roomId: roomId,
          userId: token.data,
          paymentTerm,
          paymentID: session.id,
          paymentUrl: session.url,
        },
      });
      await this.prismaService.room.update({
        where: {
          id: room.id,
        },
        data: {
          availability: 'Unavailable',
        },
      });
      return { paymentLink: session.url };
    } else {
      throw new HttpException(
        'Não é possível reservar esse quarto',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get()
  @ApiHeader({
    name: 'token',
    description: 'Token de acesso',
    required: true,
    example: 'token <token>',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos as reservas por usuario',
    description: 'Rota para listar todos as reservas por usuario.',
  })
  async listAll(@Headers() headers: Record<string, string>) {
    const token = <IJWT>this.jwt.decode(headers.token);
    return this.prismaService.booking.findMany({
      where: {
        userId: token.data,
      },
    });
  }

  @Get('hotel/:id')
  @ApiOperation({
    summary: 'Listar todos as reservas por hotel',
    description: 'Rota para listar todos as reservas por hotel.',
  })
  async listAllHotel(@Param('id') id: string) {
    const roomsIDs = await this.prismaService.room.findMany({
      where: {
        hotelId: id,
        availability: 'Unavailable',
      },
      select: {
        id: true,
      },
    });
    const rooms = await this.prismaService.booking.findMany({
      where: {
        status: 'Confirmed',
        roomId: {
          in: roomsIDs.map((item) => item.id),
        },
      },
    });
    return rooms;
  }

  @Delete(':id')
  @ApiHeader({
    name: 'token',
    description: 'Token de acesso',
    required: true,
    example: 'token <token>',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancelar reserva',
    description: 'Rota para cancelar reserva.',
  })
  @ApiResponse({ status: 200, description: 'Reserva canselada' })
  @ApiResponse({
    status: 400,
    description: 'Não foi possível cancelar reserva',
  })
  async cancel(@Param('id') id: string) {
    try {
      await this.prismaService.booking.update({
        where: {
          id,
        },
        data: {
          status: 'Cancelada',
        },
      });
      return { message: 'Reserva canselada' };
    } catch (error) {
      throw new HttpException(
        'Não foi possível cancelar reserva',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('check/:id')
  @ApiHeader({
    name: 'token',
    description: 'Token de acesso',
    required: true,
    example: 'token <token>',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Realizar check in ',
    description: 'Rota para realizar check in .',
  })
  @ApiResponse({ status: 200, description: 'Check in realizado' })
  @ApiResponse({
    status: 400,
    description: 'Não foi possivel realizar check in',
  })
  async checkBooking(@Param('id') id: string) {
    try {
      await this.prismaService.booking.update({
        where: {
          id,
        },
        data: {
          status: 'Check',
        },
      });
      return { message: 'Check in realizado' };
    } catch (error) {
      throw new HttpException(
        'Não foi possivel realizar check in',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('checkOut/:id')
  @ApiHeader({
    name: 'token',
    description: 'Token de acesso',
    required: true,
    example: 'token <token>',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Realizar check out.',
    description: 'Rota para realizar check out.',
  })
  @ApiResponse({ status: 200, description: 'Check out realizado' })
  @ApiResponse({
    status: 400,
    description: 'Não foi possivel realizar check out',
  })
  async checkOutBooking(@Param('id') id: string) {
    try {
      const booking = await this.prismaService.booking.update({
        where: {
          id,
        },
        data: {
          status: 'Check',
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
      return { message: 'Check out realizado' };
    } catch (error) {
      throw new HttpException(
        'Não foi possivel realizar check out',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
