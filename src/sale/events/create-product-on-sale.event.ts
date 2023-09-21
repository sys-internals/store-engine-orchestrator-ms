import { CreateProductRequest } from "../dtos/create-product-request.dto";

export class CreateProductOnSaleEvent {
    constructor(event: any) {
        this.title = event.title;
        this.product = { idProduct: event.product.idProduct };
        this.price = event.price;
        this.saleStartDatetime = event.saleStartDatetime;
        this.saleEndDatetime = event.saleEndDatetime;
        this.catalog = { idProductCatalog: event.catalog.idProductCatalog };
    }

    idProductOnSale: number | null;
    title: string;
    product: {
        idProduct: number;
    }
    price: string;
    saleStartDatetime: string;
    saleEndDatetime: string;
    catalog: {
        idProductCatalog: number;
    }
}
