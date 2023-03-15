import { Injectable } from '@nestjs/common';
import { ICoffeeShopService } from './interfaces/coffee-shops-service.interface';
import { CreateCoffeeShopInput, CreateCoffeeShopOutput } from './dto/create-coffee-shop.dto';
import { COMMON_ERROR } from 'src/common/constants/error.constant';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../libs/logger/logger.service';
import * as chalk from 'chalk';
import * as winston from 'winston';
import { CoffeeShopsRepository } from './repository/coffee-shops.repository';
import { COFFEE_SHOP_SUCCESS } from 'src/common/constants/success.constant';
import { EditCoffeeShopInput, EditCoffeeShopOutput } from './dto/edit-coffee-shop.dto';
import { COFFEE_SHOP_ERROR } from '../common/constants/error.constant';
import { Category } from './entities/category.entity';
import { SeeCoffeeShopsOutput, SeeCoffeeShopsInput } from './dto/see-coffee-shops.dto';
import { SeeCoffeeShopInput, SeeCoffeeShopOutput } from './dto/see-coffee-shop.dto';
import { SeeCategoriesInput, SeeCategoriesOutput } from './dto/see-categories.dto';
import { SeeCategoryInput, SeeCategoryOutput } from './dto/see-category.dto';

@Injectable()
export class CoffeeShopsService implements ICoffeeShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LoggerService,
    private readonly coffeeShopsRepository: CoffeeShopsRepository,
  ) {}

  successLogger(service: { name: string }, method: string): winston.Logger {
    const colorName = chalk.yellow(service.name);
    const colorMethod = chalk.cyan(`${this[`${method}`].name}()`);
    const colorSuccess = chalk.green('데이터 호출 성공');
    return this.log.logger().info(`${colorName} => ${colorMethod} | Success Message ::: ${colorSuccess}`);
  }

  async totalShops(coffeeShopId: number): Promise<number> {
    const totalShops = await this.prisma.coffeeShop
      .count({
        where: {
          categories: {
            some: {
              id: coffeeShopId,
            },
          },
        },
      })
      .catch(error => error && 0);
    this.successLogger(CoffeeShopsService, this.totalShops.name);
    return totalShops;
  }

  async createCoffeeShop(
    { name, latitude, longitude, categoryName }: CreateCoffeeShopInput,
    userId: number,
  ): Promise<CreateCoffeeShopOutput> {
    try {
      // ! transaction 시작
      await this.prisma.$transaction(async transaction => {
        const coffeeShop = await this.coffeeShopsRepository.createCoffeeShop(
          { name, latitude, longitude, userId },
          transaction,
        );
        const category = await this.coffeeShopsRepository.getOrCreateCategory(categoryName, transaction);

        await this.coffeeShopsRepository.updateCoffeeShop(coffeeShop.id, category, transaction);
      });

      return {
        ok: true,
        message: COFFEE_SHOP_SUCCESS.createCoffeeShop.text,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }

  async editCoffeeShop(
    { coffeeShopId, name, latitude, longitude, categoryName }: EditCoffeeShopInput,
    userId: number,
  ): Promise<EditCoffeeShopOutput> {
    try {
      const coffeeShop = await this.prisma.coffeeShop.findUnique({ where: { id: coffeeShopId } });

      // ! 카페 데이터가 존재 하지 않을 경우
      if (!coffeeShop) {
        return {
          ok: false,
          error: new Error(COFFEE_SHOP_ERROR.notExistCoffeeShop.error),
          message: COFFEE_SHOP_ERROR.notExistCoffeeShop.text,
        };
      }

      // ! 카페 데이터의 소유자가 아닐 경우
      if (coffeeShop.userId !== userId) {
        return {
          ok: false,
          error: new Error(COFFEE_SHOP_ERROR.notOwner.error),
          message: COFFEE_SHOP_ERROR.notOwner.text,
        };
      }

      let category: Category = null;
      if (categoryName) {
        category = await this.coffeeShopsRepository.getOrCreateCategory(categoryName);
      }
      await this.prisma.coffeeShop.update({
        where: { id: coffeeShop.id },
        data: {
          name,
          latitude,
          longitude,
          ...(category && {
            categories: {
              connectOrCreate: { where: { slug: category.slug }, create: { name: category.name, slug: category.slug } },
            },
          }),
        },
      });
      // * success
      return {
        ok: true,
        message: COFFEE_SHOP_SUCCESS.editCoffeeShop.text,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }

  async seeCoffeeShops({ page }: SeeCoffeeShopsInput): Promise<SeeCoffeeShopsOutput> {
    try {
      const coffeeShopResultArray = [];
      const categoryResultArray = [];
      const coffeeShops = await this.prisma.coffeeShop.findMany({
        include: { categories: true, photos: true, user: true },
        take: 5,
        skip: (page - 1) * 5,
      });

      for (const coffeeShop of coffeeShops) {
        for (const category of coffeeShop.categories) {
          const totalShops = await this.totalShops(category.id);
          const { name, id, slug } = category;
          categoryResultArray.push({ id, name, slug, totalShops });
          coffeeShopResultArray.push({ ...coffeeShop, categories: categoryResultArray });
        }
      }
      // * success
      return {
        ok: true,
        message: COFFEE_SHOP_SUCCESS.seeCoffeeShops.text,
        totalPages: Math.ceil(coffeeShopResultArray.length / 5),
        shops: coffeeShopResultArray,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }
  async seeCoffeeShop({ id }: SeeCoffeeShopInput): Promise<SeeCoffeeShopOutput> {
    try {
      const categoryResultArray = [];
      const coffeeShop = await this.prisma.coffeeShop.findUnique({
        where: { id },
        include: { categories: true, photos: true, user: true },
      });

      for (const category of coffeeShop.categories) {
        const totalShops = await this.totalShops(category.id);
        const { name, id, slug } = category;
        categoryResultArray.push({ id, name, slug, totalShops });
      }

      // * success
      return {
        ok: true,
        message: COFFEE_SHOP_SUCCESS.seeCoffeeShop.text,
        coffeeShop: {
          ...coffeeShop,
          categories: categoryResultArray,
        },
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }

  async seeCategories({ page }: SeeCategoriesInput): Promise<SeeCategoriesOutput> {
    try {
      const categoryResultArray = [];
      const categories = await this.prisma.category.findMany({
        include: { shops: true },
        take: 5,
        skip: (page - 1) * 5,
      });
      for (const category of categories) {
        const totalShops = await this.totalShops(category.id);
        categoryResultArray.push({ ...category, totalShops });
      }

      // * success
      return {
        ok: true,
        message: COFFEE_SHOP_SUCCESS.seeCategories.text,
        categories: categoryResultArray,
        totalPages: Math.ceil(categoryResultArray.length / 5),
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }

  async seeCategory({ slug, page }: SeeCategoryInput): Promise<SeeCategoryOutput> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { slug },
        include: { shops: { take: 5, skip: (page - 1) * 5 } },
      });
      const totalShops = await this.totalShops(category.id);
      // * success
      return {
        ok: true,
        message: COFFEE_SHOP_SUCCESS.seeCategory.text,
        totalPages: Math.ceil(totalShops / 5),
        category: {
          ...category,
          totalShops,
        },
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }
}
