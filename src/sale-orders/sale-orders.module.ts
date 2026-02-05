import { Module } from '@nestjs/common';
import { SaleOrdersService } from './sale-orders.service';
import { SaleOrdersController } from './sale-orders.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [SaleOrdersController],
  providers: [SaleOrdersService],
  exports: [SaleOrdersService],
})
export class SaleOrdersModule {}
