import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import type { Report } from '@prisma/client';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate sales report for date range
   */
  async generateSalesReport(dto: GenerateReportDto): Promise<Report> {
    const { startDate, endDate } = dto;

    // Get sales data
    await this.prisma.saleOrder.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        status: 'paid',
      },
      include: { items: true },
    });

    // Store in database
    const report = await this.prisma.report.create({
      data: {
        type: 'sales',
        status: ReportStatus.completed,
        lastRunAt: new Date(),
        downloadUrl: null,
      },
    });

    return report;
  }

  /**
   * Generate inventory report
   */
  async generateInventoryReport(): Promise<Report> {
    await this.prisma.product.findMany();

    const report = await this.prisma.report.create({
      data: {
        type: 'inventory',
        status: ReportStatus.completed,
        lastRunAt: new Date(),
        downloadUrl: null,
      },
    });

    return report;
  }

  /**
   * Generate product performance report
   */
  async generatePerformanceReport(dto: GenerateReportDto): Promise<Report> {
    const { startDate, endDate } = dto;

    await this.prisma.saleOrder.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { items: true },
    });

    const report = await this.prisma.report.create({
      data: {
        type: 'performance',
        status: ReportStatus.completed,
        lastRunAt: new Date(),
        downloadUrl: null,
      },
    });

    return report;
  }

  /**
   * Get all reports
   */
  async findAll(): Promise<Report[]> {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get report by ID
   */
  async findOne(id: string): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  /**
   * Download report (mock endpoint returns CSV-like mock data)
   */
  async downloadReport(id: string): Promise<{
    filename: string;
    content: string;
  }> {
    const report = await this.findOne(id);

    const content = `Report ID,Type,Created At,Status
${report.id},${report.type},${report.createdAt.toISOString()},${report.status}`;

    return {
      filename: `${report.type}-report-${report.id}.csv`,
      content,
    };
  }

  /**
   * Delete report by ID
   */
  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.report.delete({
        where: { id: parseInt(id, 10) },
      });
      return true;
    } catch {
      return false;
    }
  }
}
