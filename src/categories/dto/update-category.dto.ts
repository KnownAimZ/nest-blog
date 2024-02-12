import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from 'categories/dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
