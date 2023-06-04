import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Reserva-Flex API')
    .setDescription(
      'Este é um sistema de reservas construído com o NestJS que permite aos usuários fazerem reservas em hotel.',
    )
    .setVersion('1.0')
    .addTag('Exemplo', 'Hotel')
    .addTag('Room')
    .addTag('User')
    .addTag('Webhook')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
