import { CreateProductRequest } from "../dtos/create-product-request.dto";

export class CreateProductEvent {
    constructor({ product }: CreateProductRequest) {
        this.product = {
            name: product.name,
            description: product.description,
            enterprise: {
                name: product.enterprise.name
            }
        }
    }

    product?: {
        idProduct?: number | null;
        name: string;
        description: string;
        enterprise?: {
            idEnterprise?: number | null;
            name: string;
        };
    };
}