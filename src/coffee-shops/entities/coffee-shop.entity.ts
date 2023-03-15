import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { CoffeeShopPhoto } from './coffee-shop-photo.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from './category.entity';

@InputType('CoffeeShopInputType', { isAbstract: true })
@ObjectType()
export class CoffeeShop extends CoreEntity {
  @Field(_type => String)
  @IsString({ message: '카페 이름은 문자열이어야 합니다.' })
  name: string;

  @Field(_type => String)
  @IsString({ message: '카페 주소는 문자열이어야 합니다.' })
  latitude: string;

  @Field(_type => String)
  @IsString({ message: '카페 주소는 문자열이어야 합니다.' })
  longitude: string;

  @Field(_type => [CoffeeShopPhoto], { nullable: true })
  @IsArray({ message: '사진은 배열이어야 합니다.' })
  @IsOptional()
  photos?: CoffeeShopPhoto[];

  @Field(_type => User, { nullable: true })
  @IsObject({ message: '사용자는 객체이어야 합니다.' })
  @IsOptional()
  user?: User;

  @Field(_type => [Category], { nullable: true })
  @IsArray({ message: '카테고리는 배열이어야 합니다.' })
  @IsOptional()
  categories?: Category[];
}
