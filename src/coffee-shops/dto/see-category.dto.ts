import { IsObject, IsOptional } from 'class-validator';
import { Category } from '../entities/category.entity';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { PaginationOutput, PaginationInput } from '../../common/dto/pagination.dto';

@InputType()
export class SeeCategoryInput extends PaginationInput {
  @Field(_type => String)
  slug: string;
}

@ObjectType()
export class SeeCategoryOutput extends PaginationOutput {
  @Field(_type => Category, { nullable: true })
  @IsObject({ message: '카테고리 데이터는 객체이여야 합니다.' })
  @IsOptional()
  category?: Category;
}
