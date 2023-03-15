import { CreateCoffeeShopInput, CreateCoffeeShopOutput } from '../dto/create-coffee-shop.dto';
import * as winston from 'winston';
import { EditCoffeeShopOutput, EditCoffeeShopInput } from '../dto/edit-coffee-shop.dto';
import { SeeCoffeeShopsOutput, SeeCoffeeShopsInput } from '../dto/see-coffee-shops.dto';
import { SeeCoffeeShopInput, SeeCoffeeShopOutput } from '../dto/see-coffee-shop.dto';
import { SeeCategoriesOutput, SeeCategoriesInput } from '../dto/see-categories.dto';
import { SeeCategoryOutput, SeeCategoryInput } from '../dto/see-category.dto';
export interface ICoffeeShopService {
  successLogger(service: { name: string }, method: string): winston.Logger;
  createCoffeeShop(
    { name, latitude, longitude }: CreateCoffeeShopInput,
    userId: number,
  ): Promise<CreateCoffeeShopOutput>;

  editCoffeeShop(
    { coffeeShopId, name, latitude, longitude, categoryName }: EditCoffeeShopInput,
    userId: number,
  ): Promise<EditCoffeeShopOutput>;

  seeCoffeeShops({ page }: SeeCoffeeShopsInput): Promise<SeeCoffeeShopsOutput>;
  seeCoffeeShop({ id }: SeeCoffeeShopInput): Promise<SeeCoffeeShopOutput>;

  seeCategories({ page }: SeeCategoriesInput): Promise<SeeCategoriesOutput>;
  seeCategory({ slug, page }: SeeCategoryInput): Promise<SeeCategoryOutput>;
}
