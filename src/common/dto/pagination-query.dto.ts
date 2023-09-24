import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';

export class PaginationQueryDto {
  @ApiProperty({
    default: 10,
    format: 'number',
    minimum: 1,
    title: 'limit',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    default: 0,
    format: 'number',
    minimum: 0,
    title: 'offset',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  offset?: number;

  @ApiProperty({
    format: 'string',
    title: 'orderBy',
    description: 'Use field name here',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({
    format: 'string',
    title: 'orderDirection',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsString()
  orderDirection?: FindOptionsOrderValue;
}
