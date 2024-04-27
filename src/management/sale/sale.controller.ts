import { Body, Controller, Post } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateProductRequest } from '../product/dtos/create-product-request.dto';

@Controller('sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Post()
    create(@Body() payload: any) {
        this.saleService.processSale(payload);
    }

}
