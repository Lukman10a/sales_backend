import { SaleOrderItemDto } from './sale-order-item.dto';
export declare enum SaleOrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class UpdateSaleOrderDto {
    items?: SaleOrderItemDto[];
    status?: SaleOrderStatus;
    notes?: string;
    customerName?: string;
}
