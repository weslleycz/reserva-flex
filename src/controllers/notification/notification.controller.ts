import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { RedisService } from '../../services/redis.service';
import { JWTService } from 'src/services/jwt.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

type IJWT = {
  data: string;
};

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private redisService: RedisService, private jwt: JWTService) {}

  @Get()
  @ApiOperation({
    summary: 'Disparar notificação',
    description: 'Essa rota dispara evento de notificação.',
  })
  @ApiQuery({
    name: 'token',
    description: 'Token do usuário',
    required: true,
  })
  async stream(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const token = <IJWT>this.jwt.decode(req.query.token as string);

    // Envia uma primeira notificação com a mensagem atual, se existir
    let mensagem = await this.redisService.getValue(token.data);
    if (mensagem) {
      res.write(`data: ${mensagem}\n\n`);
    }

    // Mantém a conexão aberta
    res.flushHeaders();

    // Aguarda a próxima mensagem e envia a notificação
    const interval = setInterval(async () => {
      const novaMensagem = await this.redisService.getValue(token.data);
      if ((novaMensagem && novaMensagem !== mensagem) || novaMensagem != null) {
        res.write(`data: ${novaMensagem}\n\n`);
        mensagem = novaMensagem;
        await this.redisService.delValue(token.data);
      }
    }, 2000);

    // Quando o cliente se desconectar, para de enviar eventos
    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
}
