import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateSalesReport(dto: GenerateReportDto): Promise<{
        createdAt: Date;
        id: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        type: string;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
    }>;
    generateInventoryReport(): Promise<{
        createdAt: Date;
        id: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        type: string;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
    }>;
    generatePerformanceReport(dto: GenerateReportDto): Promise<{
        createdAt: Date;
        id: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        type: string;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
    }>;
    findAll(): Promise<{
        createdAt: Date;
        id: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        type: string;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
    }[]>;
    findOne(id: string): Promise<{
        createdAt: Date;
        id: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        type: string;
        schedule: string | null;
        lastRunAt: Date | null;
        downloadUrl: string | null;
        createdBy: number | null;
    }>;
    downloadReport(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
