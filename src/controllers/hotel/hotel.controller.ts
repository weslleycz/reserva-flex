import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { CreateHotelDto } from 'src/validators/CreateHotelDto';
import { ValidationPipe } from '@nestjs/common';
import { UpdateHotelDto } from 'src/validators/UpdateHotelDto';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar hotels',
    description: 'Essa rota lista todos os hotels.',
  })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de hotels' })
  async getHotels() {
    return this.prisma.hotel.findMany();
  }

}
