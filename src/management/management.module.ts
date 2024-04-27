import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SaleController } from './sale/sale.controller';
import { SaleService } from './sale/sale.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'PERSISTENCE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_PERSISTENCE_IP'),
            port: configService.get<number>('STORE_ENGINE_PERSISTENCE_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
      {
        name: 'SANITIZER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_SANITIZER_IP'),
            port: configService.get<number>('STORE_ENGINE_SANITIZER_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
      {
        name: 'VALIDATOR',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_DTO_VALIDATOR_IP'),
            port: configService.get<number>('STORE_ENGINE_DTO_VALIDATOR_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
      {
        name: 'TRANSFORMER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_TRANSFORMER_IP'),
            port: configService.get<number>('STORE_ENGINE_TRANSFORMER_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
      {
        name: 'WORKFLOW_SERIALIZER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_SERIALIZER_IP'),
            port: configService.get<number>('STORE_ENGINE_SERIALIZER_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
      {
        name: 'PRODUCT_MANAGEMENT_REGISTER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_MANAGEMENT_REGISTER_IP'),
            port: configService.get<number>('STORE_ENGINE_MANAGEMENT_REGISTER_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
      {
        name: 'LOADER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('STORE_ENGINE_LOADER_IP'),
            port: configService.get<number>('STORE_ENGINE_LOADER_PORT'),
          } as Record<string, any>
        }),
        inject: [ConfigService],
      },
    ])
  ],
  controllers: [ProductController, SaleController],
  providers: [ProductService, SaleService]
})
export class ManagementModule { }
