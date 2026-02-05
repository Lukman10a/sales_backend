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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    reports = [];
    reportIdCounter = 1;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateSalesReport(dto) {
        const { startDate, endDate } = dto;
        const orders = await this.prisma.saleOrder.findMany({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
                status: 'paid',
            },
            include: { items: true },
        });
        const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const report = {
            id: `report-${this.reportIdCounter++}`,
            type: 'sales',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            generatedAt: new Date(),
            totalSales,
            totalOrders: orders.length,
            downloadUrl: `/reports/download/report-${this.reportIdCounter - 1}`,
        };
        this.reports.push(report);
        return report;
    }
    async generateInventoryReport() {
        const products = await this.prisma.product.findMany();
        const lowStockProducts = products.filter((p) => p.stock <= (p.lowStockThreshold || 10));
        const report = {
            id: `report-${this.reportIdCounter++}`,
            type: 'inventory',
            startDate: new Date(),
            endDate: new Date(),
            generatedAt: new Date(),
            totalSales: lowStockProducts.length,
            totalOrders: products.length,
            downloadUrl: `/reports/download/report-${this.reportIdCounter - 1}`,
        };
        this.reports.push(report);
        return report;
    }
    async generatePerformanceReport(dto) {
        const { startDate, endDate } = dto;
        const orders = await this.prisma.saleOrder.findMany({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            include: { items: true },
        });
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
        const report = {
            id: `report-${this.reportIdCounter++}`,
            type: 'performance',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            generatedAt: new Date(),
            totalSales: totalRevenue,
            totalOrders: orders.length,
            downloadUrl: `/reports/download/report-${this.reportIdCounter - 1}`,
        };
        this.reports.push(report);
        return report;
    }
    findAll() {
        return Promise.resolve(this.reports);
    }
    findOne(id) {
        return Promise.resolve(this.reports.find((r) => r.id === id));
    }
    async downloadReport(id) {
        const report = await this.findOne(id);
        if (!report) {
            throw new Error('Report not found');
        }
        const content = `Report ID,Type,Start Date,End Date,Total Sales,Total Orders
${report.id},${report.type},${report.startDate.toISOString()},${report.endDate.toISOString()},${report.totalSales},${report.totalOrders}`;
        return {
            filename: `${report.type}-report-${report.id}.csv`,
            content,
        };
    }
    remove(id) {
        const index = this.reports.findIndex((r) => r.id === id);
        if (index > -1) {
            this.reports.splice(index, 1);
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map