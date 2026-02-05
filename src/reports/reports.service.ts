import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ReportsService {
  // In-memory storage for demo (use database in production)
  private reports: SalesReport[] = [];
  private reportIdCounter = 1;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate sales report for date range
   */
  async generateSalesReport(dto: GenerateReportDto): Promise<SalesReport> {
    const { startDate, endDate } = dto;

    // Get sales data
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

    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    const report: SalesReport = {
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

  /**
   * Generate inventory report
   */
  async generateInventoryReport(): Promise<SalesReport> {
    const products = await this.prisma.product.findMany();

    const lowStockProducts = products.filter(
      (p) => p.stock <= (p.lowStockThreshold || 10),
    );

    const report: SalesReport = {
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

  /**
   * Generate product performance report
   */
  async generatePerformanceReport(
    dto: GenerateReportDto,
  ): Promise<SalesReport> {
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

    const report: SalesReport = {
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

  /**
   * Get all reports
   */
  findAll(): Promise<SalesReport[]> {
    return Promise.resolve(this.reports);
  }

  /**
   * Get report by ID
   */
  findOne(id: string): Promise<SalesReport | undefined> {
    return Promise.resolve(this.reports.find((r) => r.id === id));
  }

  /**
   * Download report (mock endpoint returns CSV-like mock data)
   */
  async downloadReport(id: string): Promise<{
    filename: string;
    content: string;
  }> {
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

  /**
   * Delete report by ID
   */
  remove(id: string): Promise<boolean> {
    const index = this.reports.findIndex((r) => r.id === id);
    if (index > -1) {
      this.reports.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}
