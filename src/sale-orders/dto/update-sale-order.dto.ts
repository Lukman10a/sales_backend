import {
  IsArray,
  IsOptional,
  IsString,
  IsEnum,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaleOrderItemDto } from './sale-order-item.dto';

export enum SaleOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class UpdateSaleOrderDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleOrderItemDto)
  items?: SaleOrderItemDto[];

  @IsOptional()
  @IsEnum(SaleOrderStatus)
  status?: SaleOrderStatus;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerName?: string;
}
