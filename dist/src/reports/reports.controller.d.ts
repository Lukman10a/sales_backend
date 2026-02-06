import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateSalesReport(dto: GenerateReportDto): Promise<{
        id: number;
        type: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
        createdAt: Date;
    }>;
    generateInventoryReport(): Promise<{
        id: number;
        type: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
        createdAt: Date;
    }>;
    generatePerformanceReport(dto: GenerateReportDto): Promise<{
        id: number;
        type: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        type: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        type: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
        createdAt: Date;
    }>;
    downloadReport(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
