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
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    prisma;
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
        const report = await this.prisma.report.create({
            data: {
                type: 'sales',
                status: client_1.ReportStatus.completed,
                lastRunAt: new Date(),
                downloadUrl: null,
            },
        });
        return report;
    }
    async generateInventoryReport() {
        const products = await this.prisma.product.findMany();
        const lowStockProducts = products.filter((p) => p.stock <= (p.minStockThreshold || 10));
        const report = await this.prisma.report.create({
            data: {
                type: 'inventory',
                status: client_1.ReportStatus.completed,
                lastRunAt: new Date(),
                downloadUrl: null,
            },
        });
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
        const report = await this.prisma.report.create({
            data: {
                type: 'performance',
                status: client_1.ReportStatus.completed,
                lastRunAt: new Date(),
                downloadUrl: null,
            },
        });
        return report;
    }
    async findAll() {
        return this.prisma.report.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const report = await this.prisma.report.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return report;
    }
    async downloadReport(id) {
        const report = await this.findOne(id);
        const content = `Report ID,Type,Created At,Status
${report.id},${report.type},${report.createdAt.toISOString()},${report.status}`;
        return {
            filename: `${report.type}-report-${report.id}.csv`,
            content,
        };
    }
    async remove(id) {
        try {
            await this.prisma.report.delete({
                where: { id: parseInt(id, 10) },
            });
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map