import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { CoffeeShop } from './coffee-shop.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsObject, IsOptional, IsString } from 'class-validator';

@InputType('CoffeePhotoInputType', { isAbstract: true })
@ObjectType()
export class CoffeeShopPhoto extends CoreEntity {
  @Field(_type => String)
  @IsString({ message: '사진 URL은 문자열이어야 합니다.' })
  url: string;

  @Field(_type => CoffeeShop, { nullable: true })
  @IsObject({ message: '카페는 객체이어야 합니다.' })
  @IsOptional()
  shop?: CoffeeShop;
}
