import { SaleOrderItemDto } from './sale-order-item.dto';
export declare class CreateSaleOrderDto {
    customerName: string;
    items: SaleOrderItemDto[];
    notes?: string;
}
