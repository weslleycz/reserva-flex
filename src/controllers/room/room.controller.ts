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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from 'src/validators/Room.dtos';
import { Request } from 'express';

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

  @Get(':id')
  @ApiOperation({
    summary: 'Selecionar quarto',
    description: 'Essa rota retorna um quarto por id.',
  })
  @ApiResponse({ status: 200, description: 'Retorna um quarto' })
  @ApiResponse({ status: 400, description: 'Quarto não encontrado' })
  async selectRoom(@Param('id') id: string) {
    try {
      return await this.prisma.room.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException('Quarto não encontrado', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('hotel/:id')
  @ApiOperation({
    summary: 'lista os quartos por hotel',
    description: 'Essa rota lista os quartos por id de hotel.',
  })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de quartos' })
  @ApiResponse({ status: 400, description: 'Hotel não encontrado' })
  @ApiParam({ name: 'id', description: 'Id do Hotel' })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: true,
    description: 'Número da página',
  })
  async getAllRoomsHotel(@Param('id') id: string, @Req() request: Request) {
    const queryParams = request.query;
    const cursor: number = +queryParams.page as number;
    if (cursor === 1 || cursor === 0) {
      try {
        const counter = await this.prisma.room.count();
        const totalPages = Math.ceil(counter / 25);
        const rooms = await this.prisma.room.findMany({
          take: 25,
          where: {
            hotelId: id,
          },
          orderBy: {
            id: 'asc',
          },
        });
        return { rooms, totalPages };
      } catch (error) {
        throw new HttpException('Hotel não encontrado', HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        const counter = await this.prisma.room.count();
        const totalPages = Math.ceil(counter / 25);
        const rooms = await this.prisma.room.findMany({
          take: 25,
          skip: cursor * 25,
          where: {
            hotelId: id,
          },
          orderBy: {
            id: 'asc',
          },
        });
        return { rooms, totalPages };
      } catch (error) {
        throw new HttpException('Hotel não encontrado', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
