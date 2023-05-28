import { Controller, Get, Render, Res } from '@nestjs/common';
import { Props } from '../../views/sucesso';
import { Response } from 'express';
import { join } from 'node:path';

@Controller('views')
export class ViewsController {
  @Get()
  @Render('sucesso')
  index(): Props {
    return { name: 'hjkkk' };
  }

  @Get('styles')
  getCSS(@Res() res: Response) {
    res.sendFile(join(__dirname, './public/styles/style.css'));
  }
}
