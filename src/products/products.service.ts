import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new product
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  /**
   * Get all products
   */
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
  }

  /**
   * Get product by ID
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Update product
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  /**
   * Delete product
   */
  async remove(id: number): Promise<Product> {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Get products with low stock
   */
  async getLowStockProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        stock: {
          lte: this.prisma.$queryRawUnsafe(
            `stock <= "minStockThreshold"`,
          ) as unknown as any,
        },
      },
    });
  }

  /**
   * Reduce stock for sale order
   */
  async reduceStock(productId: number, quantity: number): Promise<Product> {
    const product = await this.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: product.stock - quantity,
      },
    });
  }

  /**
   * Increase stock (for returns/adjustments)
   */
  async increaseStock(productId: number, quantity: number): Promise<Product> {
    const product = await this.findOne(productId);

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: product.stock + quantity,
      },
    });
  }
}
