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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: MulterFile.File,
    @Headers() headers: Record<string, string>,
  ) {
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
    const user = await this.prisma.user.update({
      where: {
        id: token.data.toString(),
      },
      data: {
        avatar: idAvatar,
      },
    });
    return { fileId };
  }
}
