import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { BcryptService } from 'src/services/bcrypt.service';
import { CreateUserDto } from '../../validators/User.dtos';
import { JWTService } from 'src/services/jwt.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
    private jwt: JWTService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Rota para criar usuário.',
  })
  @ApiResponse({ status: 200, description: 'Usuário criado' })
  @ApiResponse({ status: 400, description: 'E-mail já está cadastrado' })
  async createUser(
    @Body() { email, name, password, telephone }: CreateUserDto,
  ) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: await this.bcrypt.hashPassword(password),
          telephone,
        },
      });
      const token = this.jwt.login(user.id.toString());
      return { token };
    } catch (error) {
      throw new HttpException(
        'E-mail já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
