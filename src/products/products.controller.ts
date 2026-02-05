import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /products
   * Create a new product (owner/admin only)
   */
  @Post()
  @Roles('owner')
  @UseGuards(RolesGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * GET /products
   * Get all products
   */
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  /**
   * GET /products/low-stock
   * Get products with low stock
   */
  @Get('low-stock')
  async getLowStock() {
    return this.productsService.getLowStockProducts();
  }

  /**
   * GET /products/:id
   * Get product by ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * PATCH /products/:id
   * Update product (owner/admin only)
   */
  @Patch(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id
   * Delete product (owner/admin only)
   */
  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
