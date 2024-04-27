export class TransformProductOnSaleEvent {
    constructor(event: any) {
        this.title = event.title;
        this.product = {
            idProduct: event.product.idProduct,
            name: event.product.name,
            description: event.product.description,
            enterprise: {
                idEnterprise: event.product.enterprise.idEnterprise,
                name: event.product.enterprise.name
            }
        };
        this.price = event.price;
        this.saleStartDatetime = event.saleStartDatetime;
        this.saleEndDatetime = event.saleEndDatetime;
        this.catalog = {
            idProductCatalog: event.catalog.idProductCatalog,
            name: event.catalog.name
        };
    }

    idProductOnSale: number | null;
    title: string;
    product: {
        idProduct: number;
        name: string;
        description: string;
        enterprise: {
            idEnterprise: number;
            name: string
        }
    }
    price: number;
    saleStartDatetime: string;
    saleEndDatetime: string;
    catalog: {
        idProductCatalog: number;
        name: string;
    }
}
