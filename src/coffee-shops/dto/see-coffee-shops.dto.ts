import { IsOptional, IsArray } from 'class-validator';
import { CoffeeShop } from '../entities/coffee-shop.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { PaginationInput, PaginationOutput } from '../../common/dto/pagination.dto';

@InputType()
export class SeeCoffeeShopsInput extends PaginationInput {}

@ObjectType()
export class SeeCoffeeShopsOutput extends PaginationOutput {
  @Field(_type => [CoffeeShop], { nullable: true })
  @IsArray({ message: '카페 데이터는 배열이여야 합니다.' })
  @IsOptional()
  shops?: CoffeeShop[];
}
