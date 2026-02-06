import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';

describe('ReportsService', () => {
  let service: ReportsService;

  const now = new Date('2026-02-06T10:00:00.000Z');
  const mockReport = {
    id: 1,
    createdAt: now,
    status: ReportStatus.completed,
    type: 'sales',
    schedule: null,
    lastRunAt: now,
    downloadUrl: null,
    createdBy: null,
  };

  const mockPrismaService = {
    saleOrder: {
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    report: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSalesReport', () => {
    it('should generate sales report for date range', async () => {
      const mockOrders = [
        {
          id: 1,
          total: 100,
          status: 'paid',
          createdAt: new Date(),
          items: [],
        },
        {
          id: 2,
          total: 200,
          status: 'paid',
          createdAt: new Date(),
          items: [],
        },
      ];

      mockPrismaService.saleOrder.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.report.create.mockResolvedValue(mockReport);

      const report = await service.generateSalesReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });

      expect(report.type).toBe('sales');
      expect(report.status).toBe(ReportStatus.completed);
    });
  });

  describe('generateInventoryReport', () => {
    it('should generate inventory report', async () => {
      const mockProducts = [
        { id: 1, stock: 5, minStockThreshold: 10 },
        { id: 2, stock: 20, minStockThreshold: 10 },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.report.create.mockResolvedValue({
        ...mockReport,
        id: 2,
        type: 'inventory',
      });

      const report = await service.generateInventoryReport();

      expect(report.type).toBe('inventory');
      expect(report.status).toBe(ReportStatus.completed);
    });
  });

  describe('generatePerformanceReport', () => {
    it('should generate performance report', async () => {
      const mockOrders = [
        { id: 1, total: 500, createdAt: new Date(), items: [] },
      ];

      mockPrismaService.saleOrder.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.report.create.mockResolvedValue({
        ...mockReport,
        id: 3,
        type: 'performance',
      });

      const report = await service.generatePerformanceReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });

      expect(report.type).toBe('performance');
      expect(report.status).toBe(ReportStatus.completed);
    });
  });

  describe('findAll', () => {
    it('should return all reports', async () => {
      mockPrismaService.report.findMany.mockResolvedValue([
        mockReport,
        { ...mockReport, id: 2, type: 'inventory' },
      ]);

      const reports = await service.findAll();

      expect(reports).toHaveLength(2);
    });
  });

  describe('downloadReport', () => {
    it('should return CSV content for report', async () => {
      mockPrismaService.report.findUnique.mockResolvedValue(mockReport);

      const download = await service.downloadReport(String(mockReport.id));

      expect(download.filename).toContain('sales-report');
      expect(download.content).toContain('Report ID');
    });
  });

  describe('remove', () => {
    it('should delete report by id', async () => {
      mockPrismaService.report.delete.mockResolvedValue(mockReport);
      mockPrismaService.report.findUnique.mockResolvedValue(null);

      const removed = await service.remove(String(mockReport.id));

      expect(removed).toBe(true);
      await expect(service.findOne(String(mockReport.id))).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
