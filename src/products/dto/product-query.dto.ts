import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Product } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class ProductQuery extends PaginationQueryDto<Product> {
  @ApiProperty({
    example: 'Category_1,Category_2',
    title: 'Categories',
    description: 'List of category names',
    required: false,
    format: 'string',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  categories?: string[];
}
