import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from 'products/dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
