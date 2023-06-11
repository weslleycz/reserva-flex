import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('notification')
export class NotificationController {
  @Get()
  stream(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const token = req.query.token as string;

    // Envie um evento SSE a cada 2 segundos
    const interval = setInterval(() => {
      res.write(`data: ${new Date().toISOString()}\n\n`);
    }, 2000);

    // Quando o cliente se desconectar, pare de enviar eventos
    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
}
