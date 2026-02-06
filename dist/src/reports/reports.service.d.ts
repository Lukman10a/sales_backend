import { PrismaService } from '../prisma/prisma.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import type { Report } from '@prisma/client';
export interface SalesReportData {
    totalSales: number;
    totalOrders: number;
    period: {
        startDate: Date;
        endDate: Date;
    };
}
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateSalesReport(dto: GenerateReportDto): Promise<Report>;
    generateInventoryReport(): Promise<Report>;
    generatePerformanceReport(dto: GenerateReportDto): Promise<Report>;
    findAll(): Promise<Report[]>;
    findOne(id: string): Promise<Report>;
    downloadReport(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    remove(id: string): Promise<boolean>;
}
