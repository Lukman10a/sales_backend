import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * POST /reports/generate-sales
   * Generate sales report for date range
   */
  @Post('generate-sales')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async generateSalesReport(@Body() dto: GenerateReportDto) {
    return this.reportsService.generateSalesReport(dto);
  }

  /**
   * POST /reports/generate-inventory
   * Generate inventory report
   */
  @Post('generate-inventory')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async generateInventoryReport() {
    return this.reportsService.generateInventoryReport();
  }

  /**
   * POST /reports/generate-performance
   * Generate product performance report
   */
  @Post('generate-performance')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async generatePerformanceReport(@Body() dto: GenerateReportDto) {
    return this.reportsService.generatePerformanceReport(dto);
  }

  /**
   * GET /reports
   * Get all generated reports
   */
  @Get()
  @Roles('owner')
  @UseGuards(RolesGuard)
  async findAll() {
    return this.reportsService.findAll();
  }

  /**
   * GET /reports/:id
   * Get report by ID
   */
  @Get(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  /**
   * GET /reports/download/:id
   * Download report as CSV
   */
  @Get('download/:id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async downloadReport(@Param('id') id: string) {
    return this.reportsService.downloadReport(id);
  }

  /**
   * DELETE /reports/:id
   * Delete report by ID
   */
  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string) {
    const removed = await this.reportsService.remove(id);
    return { success: removed };
  }
}
