import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Get,
  Delete,
  Put,
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
import { CreateRoomDto, UpdateRoomDto } from 'src/validators/Room.dtos';

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
    @Body() { number, price, type, description }: CreateRoomDto,
    @Param('id') id: string,
  ) {
    try {
      await this.prisma.room.create({
        data: {
          number,
          price,
          type,
          hotelId: id,
          description,
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
    return await this.prisma.room.findMany();
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar quarto',
    description: 'Rota para deletar quarto.',
  })
  @ApiHeader({
    name: 'Security_Key',
    description: 'Token de acesso',
    required: true,
    example: 'Security_Key <token>',
  })
  @ApiResponse({ status: 200, description: 'Quarto deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Não foi possível deletar quarto' })
  async deleteRoom(@Param('id') id: string) {
    try {
      await this.prisma.room.delete({
        where: {
          id,
        },
      });
      return { message: 'Quarto deletado com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Não foi possível deletar quarto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Security_Key',
    description: 'Token de acesso',
    required: true,
    example: 'Security_Key <token>',
  })
  @ApiOperation({
    summary: 'Atualizar quarto',
    description: 'Rota para atualizar quarto.',
  })
  @ApiResponse({ status: 200, description: 'Hotel quarto' })
  @ApiResponse({
    status: 400,
    description: 'Não foi possível atualizar quarto',
  })
  async updateUser(@Param('id') id: string, @Body() data: UpdateRoomDto) {
    try {
      await this.prisma.room.update({
        where: { id },
        data,
      });
      return { message: 'Quarto atualizado' };
    } catch (error) {
      throw new HttpException(
        'Não foi possível atualizar quarto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
