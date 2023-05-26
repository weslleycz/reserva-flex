import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { CreateRoomDto } from 'src/validators/Room.dtos';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private prisma: PrismaService) {}

  @Post(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar quarto',
    description: 'Rota para criar quarto.',
  })
  @ApiHeader({
    name: 'Security_Key',
    description: 'Token de acesso',
    required: true,
    example: 'Security_Key <token>',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Id do hotel que queremos associar ao o quarto',
  })
  @ApiResponse({ status: 200, description: 'Criar quarto' })
  @ApiResponse({ status: 400, description: 'Não foi possível criar o quarto' })
  async createRoom(
    @Body() { number, price, type }: CreateRoomDto,
    @Param('id') id: string,
  ) {
    try {
      await this.prisma.room.create({
        data: {
          number,
          price,
          type,
          hotelId: id,
        },
      });
      return { message: 'Quarto criado com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Não foi possível criar o quarto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os quartos',
    description: 'Essa rota lista todos os quartos.',
  })
  @ApiResponse({ status: 200, description: 'Criar quarto' })
  async getAllRooms() {
    return this.prisma.room.findMany();
  }
}
