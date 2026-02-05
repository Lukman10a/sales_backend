import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStockThreshold!: number;

  @IsString()
  @MaxLength(50)
  sku!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
