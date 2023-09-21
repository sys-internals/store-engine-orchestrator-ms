import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PERSISTENCE',
        transport: Transport.TCP,
        options: { port: 2999 }
      },
      {
        name: 'SANITIZER',
        transport: Transport.TCP,
        options: { port: 3001 }
      },
      {
        name: 'VALIDATOR',
        transport: Transport.TCP,
        options: { port: 3002 }
      },
      {
        name: 'TRANSFORMER',
        transport: Transport.TCP,
        options: { port: 3003 }
      },
      {
        name: 'WORKFLOW_SERIALIZER',
        transport: Transport.TCP,
        options: { port: 3004 }
      },
      {
        name: 'PRODUCT_MANAGEMENT_REGISTER',
        transport: Transport.TCP,
        options: { port: 3005 }
      },
      {
        name: 'LOADER',
        transport: Transport.TCP,
        options: { port: 3006 }
      }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class SaleModule { }
