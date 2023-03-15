import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from './../entities/category.entity';

type TypeTransaction = Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;
interface ICreateCoffeeShop {
  name: string;
  latitude: string;
  longitude: string;
  userId: number;
}
@Injectable()
export class CoffeeShopsRepository {
  constructor(private prisma: PrismaService) {}

  async createCoffeeShop({ name, latitude, longitude, userId }: ICreateCoffeeShop, transaction: TypeTransaction) {
    try {
      const condition = { data: { name, latitude, longitude, user: { connect: { id: userId } } } };
      if (transaction) {
        return transaction.coffeeShop.create(condition);
      } else {
        return this.prisma.coffeeShop.create(condition);
      }
    } catch (error) {
      // ! extraError
      throw new InternalServerErrorException(error);
    }
  }

  async getOrCreateCategory(name: string, transaction?: TypeTransaction): Promise<Category> {
    try {
      const categoryName = name.trim().toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      const findCondition = { where: { slug: categorySlug } };
      const createCondition = { data: { name: categoryName, slug: categorySlug } };
      let category = transaction
        ? await transaction.category.findUnique(findCondition)
        : await this.prisma.category.findUnique(findCondition);

      if (!category) {
        category = transaction
          ? await transaction.category.create(createCondition)
          : await this.prisma.category.create(createCondition);
      }
      return category;
    } catch (error) {
      // ! extraError
      throw new InternalServerErrorException(error);
    }
  }

  async updateCoffeeShop(coffeeShopId: number, category: Category, transaction: TypeTransaction) {
    try {
      const whereCondition = { where: { id: coffeeShopId } };
      const dataCondition = {
        data: {
          categories: {
            connectOrCreate: { where: { slug: category.slug }, create: { name: category.name, slug: category.slug } },
          },
        },
      };
      if (transaction) {
        return transaction.coffeeShop.update({ ...whereCondition, ...dataCondition });
      } else {
        return this.prisma.coffeeShop.update({ ...whereCondition, ...dataCondition });
      }
    } catch (error) {
      // ! extraError
      throw new InternalServerErrorException(error);
    }
  }
}
