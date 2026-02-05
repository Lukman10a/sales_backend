import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateSalesReport(dto: GenerateReportDto): Promise<import("./reports.service").SalesReport>;
    generateInventoryReport(): Promise<import("./reports.service").SalesReport>;
    generatePerformanceReport(dto: GenerateReportDto): Promise<import("./reports.service").SalesReport>;
    findAll(): Promise<import("./reports.service").SalesReport[]>;
    findOne(id: string): Promise<import("./reports.service").SalesReport | undefined>;
    downloadReport(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
