import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { formatPaginationQuerry } from 'src/common/functions/format-pagination-querry';
import { ProductQuery } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const categories = await Promise.all(
      createProductDto.categories.map((name) =>
        this.loadOrCreateCategoryByName(name),
      ),
    );
    const product = this.productRepository.create({
      ...createProductDto,
      categories,
    });
    return this.productRepository.save(product);
  }

  async findAll(query: ProductQuery) {
    const shouldFilterByCategoryNames = !!query.categories?.length;
    const formatedQuery = formatPaginationQuerry(query);
    return await this.productRepository.find({
      ...formatedQuery,
      relations: ['categories'],
      ...(shouldFilterByCategoryNames && {
        where: { categories: { name: In(query.categories) } },
      }),
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: +id },
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return await product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const categories =
      updateProductDto.categories &&
      (await Promise.all(
        updateProductDto.categories.map((name) =>
          this.loadOrCreateCategoryByName(name),
        ),
      ));

    const product = await this.productRepository.preload({
      id: +id,
      ...updateProductDto,
      categories,
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return await this.productRepository.remove(product);
  }

  async loadOrCreateCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ name });
    if (category) {
      return category;
    }
    return this.categoryRepository.create({ name });
  }
}
