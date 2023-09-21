export class LoadProductOnSaleEvent {
    constructor(event: any) {
        this.title = event.title;
        this.price = event.price;
        this.product = {
            name: event.product.name,
            description: event.product.description,
            enterprise: {
                name: event.product.enterprise.name
            }
        }
        this.catalog = {
            name: event.catalog.name
        }
    }

    title: string;
    product: {
        name: string;
        description: string;
        enterprise: {
            name: string;
        };
    };
    price: number;
    catalog: {
        name: string;
    }
}