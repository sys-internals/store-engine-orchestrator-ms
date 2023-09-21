import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductRequest } from 'src/sale/dtos/create-product-request.dto';
import { CreateProductOnSaleEvent } from 'src/sale/events/create-product-on-sale.event';
import { LoadProductOnSaleEvent } from 'src/sale/events/load-product-on-sale.event';
import { TransformProductOnSaleEvent } from 'src/sale/events/transform-product-on-sale.event';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);
    isValid: boolean;

    constructor(
        @Inject('PERSISTENCE') private readonly persistenceClient: ClientProxy,
        // @Inject('SANITIZER') private readonly dtoSanitizerClient: ClientProxy,
        @Inject('DTO_VALIDATOR') private readonly dtoValidatorClient: ClientProxy,
        @Inject('DTO_TO_MODEL') private readonly dtoToModelClient: ClientProxy,
        // @Inject('WORKFLOW_SERIALIZER') private readonly workflowSerializerClient: ClientProxy,
        @Inject('PRODUCT_MANAGEMENT_REGISTER') private readonly productManagementClient: ClientProxy,
        @Inject('PRODUCT_ESHOP_LOADER') private readonly productEshopClient: ClientProxy
    ) { }

    async create(createProductRequest: CreateProductRequest) {
        this.logger.log(`New product to load on store: ${createProductRequest}`);
        const pattern = 'create_product';
        try {
            // const sanitizedPayload = await this.sanitize(pattern, 1, createProductRequest);
            await this.validate(pattern, 2, createProductRequest.sale);

            // const result = await this.validate(pattern, 2, createProductRequest.sale).then(
            //     (onfulfilled) => {
            //         this.logger.debug('validate then onfulfilled.');
            //         this.logger.debug('2');
            //         // this.dtoToModel(pattern, 3, createProductRequest.sale).then((dtoToModelResponse) => {
            //         //     this.logger.debug(dtoToModelResponse);
            //         //     this.loadProduct(pattern, 6, dtoToModelResponse).then(loadProductResponse => {
            //         //         this.logger.debug('loadProduct then.');
            //         //     });
            //         // }); 
            //     }, (onrejected) => this.logger.error('validate then onrejected.')
            // );
            // const customPayload = await this.workflowSerializer(pattern, 4, sanitizedPayload);
            // await this.createProduct(pattern, 5, modelPayload);
        } catch (error) {
            const searchToken = Math.floor(Math.random() * 100000000000);
            this.logger.error({
                pattern,
                searchToken,
                createProductRequest
            }, error);
            this.persistenceClient.send('event', { processCode: 1, request: createProductRequest, response: error });
            // await this.persistenceClient.send('event', { processCode: -1, request: { searchToken }, response: error });
        }
    }

    // private async sanitize(pattern: string, processCode: number, request: any) {
    //     this.dtoSanitizerClient.send(pattern, new CreateProductEvent(request)).subscribe({
    //         next: (response) => this.persistenceClient.send('event', { processCode, request, response }).subscribe(),
    //         error: (error) => new Error(`Invalid payload at pattern: ${pattern}, processCode: ${processCode}`),
    //         complete: () => this.logger.debug('sanitize complete')
    //     });
    //     return;
    // }

    private async validate(pattern: string, processCode: number, request: CreateProductOnSaleEvent) {
        return this.dtoValidatorClient.send(pattern, request).subscribe({
            next: (response) => {
                this.logger.debug({ response, message: 'Validation response' });
                this.persistenceClient.emit('event', { processCode, request, response }).subscribe({
                    next: this.logger.log,
                    error: this.logger.error,
                    complete: () => this.logger.debug('Validation event persistence complete')
                });
                if (response.isValid) {
                    this.dtoToModelClient.send(pattern, new TransformProductOnSaleEvent(request)).subscribe({
                        next: (response) => {
                            this.logger.debug({ response, message: 'Transform response' });
                            this.persistenceClient.emit('event', { processCode, request, response }).subscribe({
                                next: this.logger.log,
                                error: this.logger.error,
                                complete: () => this.logger.debug('Transform event persistence complete')
                            });
                            this.productEshopClient.send(pattern, new LoadProductOnSaleEvent(request)).subscribe({
                                next: (response) => {
                                    this.logger.debug({ response, message: 'Eshop load response' });
                                    this.persistenceClient.emit('event', { processCode, request, response }).subscribe({
                                        next: this.logger.log,
                                        error: this.logger.error,
                                        complete: () => this.logger.debug('Eshop load event persistence complete')
                                    });
                                },
                                error: (error) => this.logger.error(error),
                                complete: () => this.logger.debug('Eshop load complete')
                            })
                        },
                        error: this.logger.error,
                        complete: () => this.logger.debug('Transform complete')
                    });
                } else {
                    this.logger.error(`Invalid payload at pattern: ${pattern}, processCode: ${processCode}`);
                }
            },
            error: (error) => {
                this.logger.debug(error, 'Validation error response');
                this.persistenceClient.emit('event', { processCode, request, error }).subscribe({
                    next: this.logger.log,
                    error: this.logger.error,
                    complete: () => this.logger.debug('Persistence complete')
                });
            },
            complete: () => this.logger.debug('Validation complete')
        });

    }

    private async dtoToModel(pattern: string, processCode: number, request: any) {
        return await this.dtoToModelClient.send(pattern, new TransformProductOnSaleEvent(request)).subscribe({
            next: this.logger.log,
            error: this.logger.error,
            complete: () => this.logger.debug('Transform complete')
        });
        // this.persistenceClient.emit('event', { processCode, request, response });
        // return response;
    }

    // private async workflowSerializer(pattern: string, processCode: number, request: any) {
    //     const response = await this.workflowSerializerClient.send(pattern, new CreateProductEvent(request));
    //     await this.persistenceClient.send('event', { processCode, request, response });
    // }

    private async createProduct(pattern: string, processCode: number, request: any) {
        const response = await this.productManagementClient.send(pattern, request);
        await this.persistenceClient.emit('event', { processCode, request, response });
    }

    private async loadProduct(pattern: string, processCode: number, request: any) {
        return this.productEshopClient.send(pattern, new LoadProductOnSaleEvent(request)).subscribe({
            next: (response) => this.logger.log(response),
            error: (error) => this.logger.error(error),
            complete: () => this.logger.debug('Eshop load complete')
        });
        // await this.persistenceClient.emit('event', { processCode, request, response });
    }
}
