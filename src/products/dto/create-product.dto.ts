import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: "Product's title" })
  @IsString()
  title: string;

  @ApiProperty({ description: "Product's description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ examples: [] })
  @IsString({ each: true })
  categories: string[];
}
