export class CreateProductRequest {
    product?: {
        idProduct: number | null;
        name: string;
        description: string;
        enterprise?: {
            idEnterprise: number | null;
            name: string;
        };
    };
    sale?: {
        idProductOnSale: number | null;
        title: string;
        product: {
            idProduct: number;
            name: string;
            description: string;
            enterprise?: {
                idEnterprise: number | null;
                name: string;
            }
        }
        price: string;
        saleStartDatetime: string;
        saleEndDatetime: string;
        catalog: {
            idProductCatalog: number;
            name: string;
        }
    }
}
