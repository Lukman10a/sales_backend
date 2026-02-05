import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaleOrderItemDto } from './sale-order-item.dto';

export class CreateSaleOrderDto {
  @IsString()
  @MaxLength(50)
  customerName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleOrderItemDto)
  items!: SaleOrderItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}
