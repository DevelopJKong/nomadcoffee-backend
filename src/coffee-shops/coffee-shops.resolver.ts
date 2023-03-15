import { Resolver, Mutation, Query, ResolveField, Parent, Args, Int } from '@nestjs/graphql';
import { CoffeeShop } from './entities/coffee-shop.entity';
import { RoleData } from '@prisma/client';
import { Role } from 'src/libs/auth/role.decorator';
import { CreateCoffeeShopOutput, CreateCoffeeShopInput } from './dto/create-coffee-shop.dto';
import { User } from '../users/entities/user.entity';
import { AuthUser } from './../libs/auth/auth-user.decorator';
import { CoffeeShopsService } from './coffee-shops.service';
import { EditCoffeeShopOutput, EditCoffeeShopInput } from './dto/edit-coffee-shop.dto';
import { SeeCoffeeShopsInput, SeeCoffeeShopsOutput } from './dto/see-coffee-shops.dto';
import { SeeCoffeeShopOutput, SeeCoffeeShopInput } from './dto/see-coffee-shop.dto';
import { SeeCategoriesInput, SeeCategoriesOutput } from './dto/see-categories.dto';
import { SeeCategoryInput, SeeCategoryOutput } from './dto/see-category.dto';
import { Category } from './entities/category.entity';

@Resolver((_of?: void) => CoffeeShop)
export class CoffeeShopsResolver {
  constructor(private readonly coffeesShopService: CoffeeShopsService) {}

  @Mutation(_type => CreateCoffeeShopOutput)
  @Role([RoleData.USER, RoleData.ADMIN])
  async createCoffeeShop(@Args('input') createCoffeeShopInput: CreateCoffeeShopInput, @AuthUser() authUser: User) {
    return this.coffeesShopService.createCoffeeShop(createCoffeeShopInput, authUser.id);
  }

  @Mutation(_type => EditCoffeeShopOutput)
  @Role([RoleData.USER, RoleData.ADMIN])
  async editCoffeeShop(
    @Args('input') editCoffeeShopInput: EditCoffeeShopInput,
    @AuthUser() authUser: User,
  ): Promise<EditCoffeeShopOutput> {
    return this.coffeesShopService.editCoffeeShop(editCoffeeShopInput, authUser.id);
  }

  @Query(_type => SeeCoffeeShopsOutput)
  @Role([RoleData.USER, RoleData.ADMIN])
  async seeCoffeeShops(@Args('input') seeCoffeeShops: SeeCoffeeShopsInput): Promise<SeeCoffeeShopsOutput> {
    return this.coffeesShopService.seeCoffeeShops(seeCoffeeShops);
  }

  @Query(_type => SeeCoffeeShopOutput)
  @Role([RoleData.USER, RoleData.ADMIN])
  async seeCoffeeShop(@Args('input') seeCoffeeShopInput: SeeCoffeeShopInput): Promise<SeeCoffeeShopOutput> {
    return this.coffeesShopService.seeCoffeeShop(seeCoffeeShopInput);
  }

  @Query(_type => SeeCategoriesOutput)
  @Role([RoleData.USER, RoleData.ADMIN])
  async seeCategories(@Args('input') seeCategoriesInput: SeeCategoriesInput): Promise<SeeCategoriesOutput> {
    return this.coffeesShopService.seeCategories(seeCategoriesInput);
  }

  @Query(_type => SeeCategoryOutput)
  @Role([RoleData.USER, RoleData.ADMIN])
  async seeCategory(@Args('input') seeCategoryInput: SeeCategoryInput): Promise<SeeCategoryOutput> {
    return this.coffeesShopService.seeCategory(seeCategoryInput);
  }
}

@Resolver((_of?: void) => Category)
export class CategoryResolver {
  constructor(private readonly coffeesShopService: CoffeeShopsService) {}

  @ResolveField(_type => Int)
  async totalShops(@Parent() category: Category): Promise<number> {
    return this.coffeesShopService.totalShops(category.id);
  }
}
