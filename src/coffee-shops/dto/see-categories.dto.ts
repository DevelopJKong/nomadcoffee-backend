import { IsArray, IsOptional } from 'class-validator';
import { Category } from './../entities/category.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginationOutput, PaginationInput } from '../../common/dto/pagination.dto';

@InputType()
export class SeeCategoriesInput extends PaginationInput {}

@ObjectType()
export class SeeCategoriesOutput extends PaginationOutput {
  @Field(_type => [Category], { nullable: true })
  @IsArray({ message: '카테고리 데이터는 배열이여야 합니다.' })
  @IsOptional()
  categories?: Category[];
}
