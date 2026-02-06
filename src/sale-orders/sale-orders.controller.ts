import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SaleOrdersService } from './sale-orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateSaleOrderDto } from './dto/create-sale-order.dto';

@Controller('sale-orders')
@UseGuards(JwtAuthGuard)
export class SaleOrdersController {
  constructor(private readonly saleOrdersService: SaleOrdersService) {}

  /**
   * POST /sale-orders
   * Create a new sale order
   */
  @Post()
  async create(@Body() createSaleOrderDto: CreateSaleOrderDto) {
    return this.saleOrdersService.create(createSaleOrderDto);
  }

  /**
   * GET /sale-orders
   * Get all sale orders
   */
  @Get()
  @Roles('owner')
  @UseGuards(RolesGuard)
  async findAll() {
    return this.saleOrdersService.findAll();
  }

  /**
   * GET /sale-orders/report/by-date
   * Get sales by date range
   */
  @Get('report/by-date')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async getByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.saleOrdersService.getSalesByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * GET /sale-orders/:id
   * Get sale order by ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleOrdersService.findOne(id);
  }

  /**
   * PATCH /sale-orders/:id/status
   * Update sale order status
   */
  @Patch(':id/status')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'pending' | 'paid' | 'refunded',
  ) {
    return this.saleOrdersService.updateStatus(id, status);
  }

  /**
   * PATCH /sale-orders/:id/items
   * Update sale order items
   */
  @Patch(':id/items')
  async updateItems(
    @Param('id', ParseIntPipe) id: number,
    @Body('items')
    items: Array<{ productId: number; quantity: number; price: number }>,
  ) {
    return this.saleOrdersService.updateItems(id, items);
  }

  /**
   * PATCH /sale-orders/:id/cancel
   * Cancel sale order
   */
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.saleOrdersService.cancel(id);
  }
}
