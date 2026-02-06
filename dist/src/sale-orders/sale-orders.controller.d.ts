import { SaleOrdersService } from './sale-orders.service';
import { CreateSaleOrderDto } from './dto/create-sale-order.dto';
export declare class SaleOrdersController {
    private readonly saleOrdersService;
    constructor(saleOrdersService: SaleOrdersService);
    create(createSaleOrderDto: CreateSaleOrderDto): Promise<{
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    } & {
        items: Array<{
            productId: number;
            quantity: number;
            price: number;
        }>;
    }>;
    findAll(): Promise<({
        items: {
            id: number;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getByDateRange(startDate: string, endDate: string): Promise<({
        items: {
            id: number;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: number): Promise<{
        items: {
            id: number;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: number, status: 'pending' | 'paid' | 'refunded'): Promise<{
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateItems(id: number, items: Array<{
        productId: number;
        quantity: number;
        price: number;
    }>): Promise<{
        items: {
            id: number;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: number;
            orderId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    cancel(id: number): Promise<{
        createdAt: Date;
        id: number;
        customerName: string;
        status: import("@prisma/client").$Enums.SaleStatus;
        paymentState: import("@prisma/client").$Enums.PaymentStatus;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
}
