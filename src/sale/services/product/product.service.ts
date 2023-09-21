import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductRequest } from 'src/sale/dtos/create-product-request.dto';
import { CreateProductOnSaleEvent } from 'src/sale/events/create-product-on-sale.event';
import { LoadProductOnSaleEvent } from 'src/sale/events/load-product-on-sale.event';
import { TransformProductOnSaleEvent } from 'src/sale/events/transform-product-on-sale.event';
import { firstValueFrom } from 'rxjs'
import { ValidateProductOnSaleEvent } from 'src/sale/events/validate-product-on-sale.event';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @Inject('PERSISTENCE') private readonly persistenceClient: ClientProxy,
        @Inject('VALIDATOR') private readonly validatorClient: ClientProxy,
        @Inject('TRANSFORMER') private readonly transformerClient: ClientProxy,
        @Inject('LOADER') private readonly shopLoaderClient: ClientProxy
    ) { }

    async processProductOnSale(request: CreateProductRequest) {
        const processName = 'create_product';
        const processCode = 2;

        try {
            this.logger.log(`New product to load on store: ${JSON.stringify(request)}`);
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

    private async validate(processName: string, processCode: number, request: ValidateProductOnSaleEvent) {
        const validatorResponse = await firstValueFrom(this.validatorClient.send(processName, request));
        this.logger.debug(`Validator response: ${JSON.stringify(validatorResponse)}`);
        await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: validatorResponse }));
        return validatorResponse;
    }

    private async transform(processName: string, processCode: number, request: TransformProductOnSaleEvent) {
        const transformerResponse = await firstValueFrom(this.transformerClient.send(processName, request));
        this.logger.debug(`Transformer response: ${JSON.stringify(transformerResponse)}`);
        await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: transformerResponse }));
        return transformerResponse;
    }

    private async load(processName: string, processCode: number, request: LoadProductOnSaleEvent) {
        const loadResponse = await firstValueFrom(this.shopLoaderClient.send(processName, request), { defaultValue: {} });
        this.logger.debug(`Load response: ${JSON.stringify(loadResponse)}`);
        await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: loadResponse }));
        return loadResponse;
    }
}
