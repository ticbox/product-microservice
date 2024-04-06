import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit, page } = paginationDto;

    const totalPages = await this.product.count({where: { avilable: true }});
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        where: { avilable: true },
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta:{

        totalPages,
        currentPage: page,
        perPage: limit,
        lastPage,
      }
    }
  }

  async findOne(id: number) {


    const product =  await this.product.findFirst({
      where: { id, avilable: true}
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto
    });
    //return `This action updates a #${id} product`;
  }

  async remove(id: number) {

    await this.findOne(id);

    // return this.product.delete({
    //   where: { id }
    // });

    const product = await this.product.update({
      where: { id },
      data: { avilable: false }
    });

    return product;

    //return `This action removes a #${id} product`;
  }
}
