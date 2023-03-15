import { InputType, ObjectType, PartialType, Field } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dto/output.dto';
import { CreateCoffeeShopInput } from './create-coffee-shop.dto';
import { IsNumber } from 'class-validator';

@InputType()
export class EditCoffeeShopInput extends PartialType(CreateCoffeeShopInput) {
  @Field(_type => Number)
  @IsNumber({}, { message: 'coffeeShopId는 숫자입니다.' })
  coffeeShopId: number;
}

@ObjectType()
export class EditCoffeeShopOutput extends CoreOutput {}
