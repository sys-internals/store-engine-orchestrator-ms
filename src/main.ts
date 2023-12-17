import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(2500);

  console.log(`Application _is running on: ${await app.getUrl()}`);
}
bootstrap();
