import { IsObject, IsOptional } from 'class-validator';
import { CoreOutput } from '../../common/dto/output.dto';
import { CoffeeShop } from '../entities/coffee-shop.entity';
import { Field, PickType, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SeeCoffeeShopInput extends PickType(CoffeeShop, ['id'] as const) {}

@ObjectType()
export class SeeCoffeeShopOutput extends CoreOutput {
  @Field(_type => CoffeeShop, { nullable: true })
  @IsObject({ message: '카페 데이터는 객체이여야 합니다.' })
  @IsOptional()
  coffeeShop?: CoffeeShop;
}
