import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagementModule } from './management/management.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
