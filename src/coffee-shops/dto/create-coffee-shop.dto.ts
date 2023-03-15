import { CoreOutput } from '../../common/dto/output.dto';
import { InputType, ObjectType, PickType, Field } from '@nestjs/graphql';
import { CoffeeShop } from '../entities/coffee-shop.entity';
import { IsString } from 'class-validator';

@InputType()
export class CreateCoffeeShopInput extends PickType(CoffeeShop, ['name', 'latitude', 'longitude'] as const) {
  @Field(_type => String)
  @IsString({ message: '카테고리는 문자열이어야 합니다.' })
  categoryName: string;
}

@ObjectType()
export class CreateCoffeeShopOutput extends CoreOutput {}
