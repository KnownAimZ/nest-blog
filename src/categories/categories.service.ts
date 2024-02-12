import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from 'categories/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'categories/entities';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'common/dto';
import { formatPaginationQuerry } from 'common/functions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(`Category with this name already exists`);
      }
      throw err;
    }
  }

  async findAll(query: PaginationQueryDto) {
    return await this.categoryRepository.find(formatPaginationQuerry(query));
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return await category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException(`Category #${id} not found`);
      }
      return await this.categoryRepository.save({
        ...category,
        ...updateCategoryDto,
      });
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(`Category with this name already exists`);
      }
      throw err;
    }
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return await this.categoryRepository.remove(category);
  }
}
