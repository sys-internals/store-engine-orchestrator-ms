import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductRequest } from 'src/management/product/dtos/create-product-request.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    
    @Post()
    create(@Body() payload: CreateProductRequest) {
        console.log(payload);
        this.productService.processProductOnSale(payload.sale);    
    }
}
