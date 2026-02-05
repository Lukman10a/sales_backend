import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import type { SaleOrder } from '@prisma/client';
import { CreateSaleOrderDto } from './dto/create-sale-order.dto';

@Injectable()
export class SaleOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Create a new sale order with items
   */
  async create(createSaleOrderDto: CreateSaleOrderDto): Promise<
    SaleOrder & {
      items: Array<{ productId: number; quantity: number; price: number }>;
    }
  > {
    // Calculate total and validate product availability
    let totalAmount = 0;

    for (const item of createSaleOrderDto.items) {
      await this.productsService.findOne(item.productId);
      totalAmount += item.quantity * item.price;
    }

    // Create order with items
    const order = await this.prisma.saleOrder.create({
      data: {
        customerName: createSaleOrderDto.customerName || 'Customer',
        total: totalAmount,
        items: {
          create: createSaleOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Reduce stock for each item
    for (const item of createSaleOrderDto.items) {
      await this.productsService.reduceStock(item.productId, item.quantity);
    }

    return order as any;
  }

  /**
   * Get all sale orders
   */
  async findAll() {
    return this.prisma.saleOrder.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get sale order by ID
   */
  async findOne(id: number) {
    const order = await this.prisma.saleOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Sale order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Update sale order status
   */
  async updateStatus(
    id: number,
    status: 'pending' | 'paid' | 'refunded',
  ): Promise<SaleOrder> {
    const order = await this.findOne(id);

    // Validate status transition
    const validTransitions: Record<
      string,
      Array<'pending' | 'paid' | 'refunded'>
    > = {
      pending: ['paid', 'refunded'],
      paid: ['refunded'],
      refunded: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`,
      );
    }

    return this.prisma.saleOrder.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Update sale order items and recalculate total
   */
  async updateItems(
    id: number,
    items: Array<{ productId: number; quantity: number; price: number }>,
  ) {
    const order = await this.findOne(id);

    if (order.status !== 'pending') {
      throw new BadRequestException('Can only edit items for pending orders');
    }

    // Delete old items
    await this.prisma.saleItem.deleteMany({
      where: { orderId: id },
    });

    // Calculate new total
    let totalAmount = 0;
    for (const item of items) {
      await this.productsService.findOne(item.productId);
      totalAmount += item.quantity * item.price;
    }

    // Create new items
    return this.prisma.saleOrder.update({
      where: { id },
      data: {
        total: totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  /**
   * Cancel sale order and restore stock
   */
  async cancel(id: number) {
    const order = await this.findOne(id);

    if (order.status !== 'pending') {
      throw new BadRequestException(
        `Can only cancel pending orders (current status: ${order.status})`,
      );
    }

    // Restore stock
    for (const item of order.items) {
      await this.productsService.increaseStock(item.productId, item.quantity);
    }

    return this.prisma.saleOrder.update({
      where: { id },
      data: { status: 'refunded' },
    });
  }

  /**
   * Get sales by date range
   */
  async getSalesByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.saleOrder.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
