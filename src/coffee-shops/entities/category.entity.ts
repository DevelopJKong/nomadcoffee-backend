import { CoreEntity } from '../../common/entities/core.entity';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { CoffeeShop } from './coffee-shop.entity';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
export class Category extends CoreEntity {
  @Field(_type => String)
  @IsString({ message: '카테고리 이름은 문자열이어야 합니다.' })
  name: string;

  @Field(_type => String)
  @IsString({ message: '카테고리 슬러그는 문자열이어야 합니다.' })
  slug: string;

  @Field(_type => [CoffeeShop], { nullable: true })
  @IsArray({ message: '카페는 배열이어야 합니다.' })
  @IsOptional()
  shops?: CoffeeShop[];

  @Field(_type => Number)
  @IsNumber({}, { message: '카페 데이터 수는 숫자이어야 합니다.' })
  @IsOptional()
  totalShops?: number;
}
