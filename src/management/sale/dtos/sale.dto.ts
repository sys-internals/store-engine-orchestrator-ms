export class Sale {
    idSale: number;
    customer: CustomerDto;
    products: ProductDto[];
    payments: PaymentDto[];
    shipping: ShippingDto;
  }
  
  export class CustomerDto {
    code: number;
  }
  
  export class ProductDto {
    code: number;
    quantity: number;
  }
  
  export class CardDto {
    pan: number;
    expirationDate: Date;
    cardholderName: string;
    cardVerificationToken: string;
  }
  
  export class BillingDto {
    address: string;
    zipCode: string;
    country: string;
  }
  
  export class TransactionDto {
    amount: number;
    currencyCode: string;
    paymentMethodCode: string;
    orderNumber: number;
  }
  
  export class VerificationDto {
    authorizationCode: string;
    transactionStatus: string;
    transactionId: string;
    timestamp: Date;
  }
  
  export class PaymentDto {
    card: CardDto;
    billing: BillingDto;
    transaction: TransactionDto;
    verification: VerificationDto;
  }
  
  export class GeolocationDto {
    latitude: number;
    longitude: number;
  }
  
  export class AddressDto {
    regionCode: number;
    regionName: string;
    comunaCode: number;
    comunaName: string;
    calleName: string;
    calleNumber: string;
    comments: string;
  }
  
  export class ReceiverDto {
    name: string;
  }
  
  export class ShippingDto {
    geolocation: GeolocationDto;
    address: AddressDto;
    receiver: ReceiverDto;
  }
  