import { PrismaService } from '../prisma/prisma.service';
import { GenerateReportDto } from './dto/generate-report.dto';
export interface SalesReport {
    id: string;
    type: 'sales' | 'inventory' | 'performance';
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    totalSales: number;
    totalOrders: number;
    downloadUrl: string;
}
export declare class ReportsService {
    private readonly prisma;
    private reports;
    private reportIdCounter;
    constructor(prisma: PrismaService);
    generateSalesReport(dto: GenerateReportDto): Promise<SalesReport>;
    generateInventoryReport(): Promise<SalesReport>;
    generatePerformanceReport(dto: GenerateReportDto): Promise<SalesReport>;
    findAll(): Promise<SalesReport[]>;
    findOne(id: string): Promise<SalesReport | undefined>;
    downloadReport(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    remove(id: string): Promise<boolean>;
}
