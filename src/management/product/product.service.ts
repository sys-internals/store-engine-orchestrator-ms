import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductRequest } from 'src/management/product/dtos/create-product-request.dto';
import { LoadProductOnSaleEvent } from 'src/management/product/events/load-product-on-sale.event';
import { TransformProductOnSaleEvent } from 'src/management/product/events/transform-product-on-sale.event';
import { firstValueFrom } from 'rxjs'
import { ValidateProductOnSaleEvent } from 'src/management/product/events/validate-product-on-sale.event';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @Inject('PERSISTENCE') private readonly persistenceClient: ClientProxy,
        @Inject('VALIDATOR') private readonly validatorClient: ClientProxy,
        @Inject('TRANSFORMER') private readonly transformerClient: ClientProxy,
        @Inject('LOADER') private readonly shopLoaderClient: ClientProxy,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Process product on sale
     * 
     * @description this method is in charge of sending to different microservices the tasks of:
     * - Validating the payload.
     * - Transforming the payload to the specific microservice, adding any other properties it needs.
     * - Loading the product to the customer shop database, which provides the shop web page.
     * - Persisting every microservice event with their request and responses.
     * 
     * @param request CreateProductRequest object
     */
    async processProductOnSale(request: CreateProductRequest) {
        const processName = 'create_product';
        const processCode = 2;

        try {
            const validatorResponse = await this.validate(processName, processCode, new ValidateProductOnSaleEvent(request));
            if (validatorResponse.isValid) {
                const transformerResponse = await this.transform(processName, processCode, new TransformProductOnSaleEvent(request));
                await this.load(processName, processCode, new LoadProductOnSaleEvent(transformerResponse));
            } else {
                this.logger.error('Invalid productOnSale: ', validatorResponse);
            }
        } catch (error) {
            const searchToken = Math.floor(Math.random() * 100000000000);
            this.logger.error({ pattern: processName, searchToken, createProductRequest: request }, error);
            firstValueFrom(this.persistenceClient.emit('event', { processCode: 1, request: request, response: error }));
        }
    }

    /**
     * Validate product on sale
     *
     * @param processName Name of the process
     * @param processCode Code of the process
     * @param request ValidateProductOnSaleEvent object
     *
     * @returns ValidateProductOnSaleEvent object
     */
    private async validate(processName: string, processCode: number, request: ValidateProductOnSaleEvent) {
        const validatorResponse = await firstValueFrom(this.validatorClient.send(processName, request));
        this.logger.debug(`Validator response: ${JSON.stringify(validatorResponse)}`);
        await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: validatorResponse }));
        this.logger.debug(`Validator persistence event sent`);
        return validatorResponse;
    }

    /**
     * Transform product on sale
     *
     * @param processName Name of the process
     * @param processCode Code of the process
     * @param request TransformProductOnSaleEvent object
     *
     * @returns TransformProductOnSaleEvent object
     */
    private async transform(processName: string, processCode: number, request: TransformProductOnSaleEvent) {
        const transformerResponse = await firstValueFrom(this.transformerClient.send(processName, request));
        this.logger.debug(`Transformer response: ${JSON.stringify(transformerResponse)}`);
        await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: transformerResponse }));
        this.logger.debug(`Transformer persistence event sent`);
        return transformerResponse;
    }

    /**
     * Load product on sale
     *
     * @param processName Name of the process
     * @param processCode Code of the process
     * @param request TransformProductOnSaleEvent object
     *
     * @returns TransformProductOnSaleEvent object
     */
    private async load(processName: string, processCode: number, request: LoadProductOnSaleEvent) {
        const loadResponse = await firstValueFrom(this.shopLoaderClient.send(processName, request), { defaultValue: {} });
        this.logger.debug(`Load response: ${JSON.stringify(loadResponse)}`);
        await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: loadResponse }));
        this.logger.debug(`Eshop Product Load persistence event sent`);
        return loadResponse;
    }
}
