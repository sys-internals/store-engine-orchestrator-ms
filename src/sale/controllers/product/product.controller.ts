import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductRequest } from 'src/sale/dtos/create-product-request.dto';
import { ProductService } from 'src/sale/services/product/product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    
    @Post()
    create(@Body() payload: CreateProductRequest) {
        this.productService.create(payload);    
    }
}
