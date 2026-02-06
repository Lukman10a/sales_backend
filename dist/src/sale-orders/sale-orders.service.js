"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const products_service_1 = require("../products/products.service");
let SaleOrdersService = class SaleOrdersService {
    prisma;
    productsService;
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async create(createSaleOrderDto) {
        let totalAmount = 0;
        for (const item of createSaleOrderDto.items) {
            await this.productsService.findOne(item.productId);
            totalAmount += item.quantity * item.price;
        }
        const order = await this.prisma.saleOrder.create({
            data: {
                customerName: createSaleOrderDto.customerName || 'Customer',
                total: totalAmount,
                items: {
                    create: createSaleOrderDto.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
        for (const item of createSaleOrderDto.items) {
            await this.productsService.reduceStock(item.productId, item.quantity);
        }
        return order;
    }
    async findAll() {
        return this.prisma.saleOrder.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const order = await this.prisma.saleOrder.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Sale order with ID ${id} not found`);
        }
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        const validTransitions = {
            pending: ['paid', 'refunded'],
            paid: ['refunded'],
            refunded: [],
        };
        if (!validTransitions[order.status]?.includes(status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${order.status} to ${status}`);
        }
        return this.prisma.saleOrder.update({
            where: { id },
            data: { status },
        });
    }
    async updateItems(id, items) {
        const order = await this.findOne(id);
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException('Can only edit items for pending orders');
        }
        for (const oldItem of order.items) {
            await this.productsService.increaseStock(oldItem.productId, oldItem.quantity);
        }
        await this.prisma.saleItem.deleteMany({
            where: { orderId: id },
        });
        let totalAmount = 0;
        for (const item of items) {
            await this.productsService.findOne(item.productId);
            totalAmount += item.quantity * item.price;
        }
        for (const item of items) {
            await this.productsService.reduceStock(item.productId, item.quantity);
        }
        return this.prisma.saleOrder.update({
            where: { id },
            data: {
                total: totalAmount,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        });
    }
    async cancel(id) {
        const order = await this.findOne(id);
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException(`Can only cancel pending orders (current status: ${order.status})`);
        }
        for (const item of order.items) {
            await this.productsService.increaseStock(item.productId, item.quantity);
        }
        return this.prisma.saleOrder.update({
            where: { id },
            data: { status: 'refunded' },
        });
    }
    async getSalesByDateRange(startDate, endDate) {
        return this.prisma.saleOrder.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.SaleOrdersService = SaleOrdersService;
exports.SaleOrdersService = SaleOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], SaleOrdersService);
//# sourceMappingURL=sale-orders.service.js.map