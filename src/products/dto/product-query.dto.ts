import { PaginationQueryDto } from 'common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class ProductQuery extends PaginationQueryDto {
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
