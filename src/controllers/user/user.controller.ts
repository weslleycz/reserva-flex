import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Headers,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { BcryptService } from 'src/services/bcrypt.service';
import { CreateUserDto, LoginUserDto } from '../../validators/User.dtos';
import { JWTService } from 'src/services/jwt.service';
import { EmailService } from 'src/services/nodemailer.service';
import { emailCreateUser } from '../../templates/emailCreateUser';
import { GridFsService } from 'src/services/gridfs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';
import { Response } from 'express';

type IJWT = {
  data: string;
};

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
    private jwt: JWTService,
    private emailService: EmailService,
    private readonly gridFsService: GridFsService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Rota para criar usuário.',
  })
  @ApiResponse({ status: 201, description: 'Retorna um token jwt' })
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
      this.emailService.send({
        email,
        text: emailCreateUser(name, email),
        title: 'Bem-vindo! Sua conta foi criada com sucesso',
      });
      return { token };
    } catch (error) {
      throw new HttpException(
        'E-mail já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Rota para criar usuário.',
  })
  @ApiResponse({ status: 200, description: 'Retorna um token jwt' })
  @ApiResponse({ status: 401, description: 'Email não vinculado' })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro inesperado' })
  async loginUser(@Body() { email, password }: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user != null) {
      if (await this.bcrypt.comparePasswords(password, user.password)) {
        const token = this.jwt.login(user.id.toString());
        return { token };
      } else {
        throw new HttpException('Senha incorreta', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Email não vinculado', HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('uploadAvatar')
  @ApiBearerAuth()
  @ApiHeader({
    name: 'token',
    description: 'Token de acesso',
    required: true,
    example: 'token <token>',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Upload feito com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Não é possível fazer upload desse arquivo',
  })
  @ApiOperation({
    summary: 'Atualizar foto de perfil',
    description: 'Rota para atualizar foto de perfil.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: MulterFile.File,
    @Headers() headers: Record<string, string>,
  ) {
    try {
      const { buffer, originalname } = file;

      const token = <IJWT>this.jwt.decode(headers.token);
      const fileStream = new Readable();
      fileStream.push(buffer);
      fileStream.push(null);

      const fileId = await this.gridFsService.uploadFile(
        fileStream,
        originalname,
      );
      const idAvatar = fileId.toString() as string;
      await this.prisma.user.update({
        where: {
          id: token.data.toString(),
        },
        data: {
          avatar: idAvatar,
        },
      });
      return { message: 'Upload feito com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Não é possível fazer upload desse arquivo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: 'Baixar a foto de perfil',
    description: 'Rota que retorna a imagem de perfil do usuario.',
  })
  @Get('avatar/:email')
  async getAvatar(@Param('email') email: string, @Res() res: Response) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user.avatar != null) {
      const fileStream = this.gridFsService.getFileStream(
        ObjectId.createFromHexString(user.avatar),
      );
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${user.avatar}`,
      });

      (await fileStream).pipe(res);
    } else {
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }
  }
}
