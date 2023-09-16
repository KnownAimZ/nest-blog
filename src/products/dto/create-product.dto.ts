import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: "Product's title" })
  @IsString()
  title: string;

  @ApiProperty({ description: "Product's description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Product's price" })
  @IsNumber()
  price: number;

  @ApiProperty({ examples: [] })
  @IsString({ each: true })
  categories: string[];
}
