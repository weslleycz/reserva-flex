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

  @Get(':id')
  @ApiOperation({
    summary: 'Selecionar hotel',
    description: 'Essa rota retorna um hotel por id.',
  })
  @ApiResponse({ status: 200, description: 'Retorna um hotel' })
  @ApiResponse({ status: 400, description: 'Hotel não encontrado' })
  async getHotel(@Param('id') id: string) {
    console.log(id);
    try {
      return await this.prisma.hotel.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException('Hotel não encontrado', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Criar hotel',
    description: 'Essa rota.',
  })
  @ApiResponse({ status: 200, description: 'Criar hotel' })
  @ApiResponse({ status: 400, description: 'Rota para criar hotel' })
  async createHotel(@Body() data: CreateHotelDto) {
    try {
      await this.prisma.hotel.create({
        data,
      });
      return { message: 'Hotel criado com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Não foi possível criar o hotel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
