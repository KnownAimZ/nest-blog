import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    return await this.categoryRepository.find();
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
