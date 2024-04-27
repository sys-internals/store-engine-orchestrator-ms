import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Sale } from './dtos/sale.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SaleService {
    private readonly logger = new Logger(SaleService.name);

    constructor(
        @Inject('PERSISTENCE') private readonly persistenceClient: ClientProxy,
        // @Inject('VALIDATOR') private readonly validatorClient: ClientProxy,
        // @Inject('TRANSFORMER') private readonly transformerClient: ClientProxy,
    ) { }

    /**
     * Process product on sale
     * 
     * @description this method is in charge of sending to different microservices the tasks of:
     * - Persisting every microservice event with their request and responses.
     * 
     * @param request CreateSaleRequest object
     */
    async processSale(request: Sale) {
        const processName = 'create_sale';
        const processCode = 3;

        try {
            await firstValueFrom(this.persistenceClient.emit('event', { processCode, request, response: {} }));
            this.logger.debug(`Persistence event sent`);
        } catch (error) {
            const searchToken = Math.floor(Math.random() * 100000000000);
            this.logger.error({ pattern: processName, searchToken, createProductRequest: request }, error);
            firstValueFrom(this.persistenceClient.emit('event', { processCode: 1, request: request, response: error }));
        }
    }
}
