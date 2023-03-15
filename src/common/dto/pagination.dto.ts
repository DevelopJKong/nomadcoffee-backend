import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from './output.dto';

@InputType()
export class PaginationInput {
  @Field(_type => Number, { defaultValue: 1, nullable: true })
  @IsNumber({}, { message: '페이지는 숫자여야 합니다.' })
  @IsOptional()
  page?: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(_type => Int, { nullable: true })
  @IsNumber({}, { message: '총 페이지는 숫자여야 합니다.' })
  totalPages?: number;
}
