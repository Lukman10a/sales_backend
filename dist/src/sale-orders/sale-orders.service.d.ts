import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import type { SaleOrder } from '@prisma/client';
import { CreateSaleOrderDto } from './dto/create-sale-order.dto';
export declare class SaleOrdersService {
    private readonly prisma;
    private readonly productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    create(createSaleOrderDto: CreateSaleOrderDto): Promise<SaleOrder & {
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
    updateStatus(id: number, status: 'pending' | 'paid' | 'refunded'): Promise<SaleOrder>;
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
    getSalesByDateRange(startDate: Date, endDate: Date): Promise<({
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
}
