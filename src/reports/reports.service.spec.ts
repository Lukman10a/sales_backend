import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockPrismaService = {
    saleOrder: {
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
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

      const report = await service.generateSalesReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });

      expect(report.type).toBe('sales');
      expect(report.totalOrders).toBe(2);
      expect(report.totalSales).toBe(300);
      expect(report.downloadUrl).toBeDefined();
    });
  });

  describe('generateInventoryReport', () => {
    it('should generate inventory report', async () => {
      const mockProducts = [
        { id: 1, stock: 5, minStockThreshold: 10 },
        { id: 2, stock: 20, minStockThreshold: 10 },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const report = await service.generateInventoryReport();

      expect(report.type).toBe('inventory');
      expect(report.totalOrders).toBe(2);
      expect(report.totalSales).toBe(1); // Only 1 low-stock product
    });
  });

  describe('generatePerformanceReport', () => {
    it('should generate performance report', async () => {
      const mockOrders = [
        { id: 1, total: 500, createdAt: new Date(), items: [] },
      ];

      mockPrismaService.saleOrder.findMany.mockResolvedValue(mockOrders);

      const report = await service.generatePerformanceReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });

      expect(report.type).toBe('performance');
      expect(report.totalSales).toBe(500);
      expect(report.totalOrders).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all reports', async () => {
      mockPrismaService.saleOrder.findMany.mockResolvedValue([]);
      mockPrismaService.product.findMany.mockResolvedValue([]);

      await service.generateSalesReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });
      await service.generateInventoryReport();

      const reports = await service.findAll();

      expect(reports).toHaveLength(2);
    });
  });

  describe('downloadReport', () => {
    it('should return CSV content for report', async () => {
      mockPrismaService.saleOrder.findMany.mockResolvedValue([]);

      const report = await service.generateSalesReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });

      const download = await service.downloadReport(report.id);

      expect(download.filename).toContain('sales-report');
      expect(download.content).toContain('Report ID');
    });
  });

  describe('remove', () => {
    it('should delete report by id', async () => {
      mockPrismaService.saleOrder.findMany.mockResolvedValue([]);

      const report = await service.generateSalesReport({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T23:59:59Z',
      });

      const removed = await service.remove(report.id);

      expect(removed).toBe(true);
      expect(await service.findOne(report.id)).toBeUndefined();
    });
  });
});
