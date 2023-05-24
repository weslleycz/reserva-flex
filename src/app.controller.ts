import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Exemplo')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Retorna Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
