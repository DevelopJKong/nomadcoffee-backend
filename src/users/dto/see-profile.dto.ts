import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { PaginationOutput, PaginationInput } from '../../common/dto/pagination.dto';

@InputType()
export class SeeProfileInput extends PaginationInput {
  @Field(_type => Number)
  id: number;
}

@ObjectType()
export class SeeProfileOutput extends PaginationOutput {
  @Field(_returns => User)
  @IsOptional()
  user?: User;

  @Field(_return => Number, { nullable: true })
  @IsNumber({}, { message: '팔로잉 횟수는 숫자여야 합니다.' })
  @IsOptional()
  totalFollowing?: number;

  @Field(_return => Number, { nullable: true })
  @IsNumber({}, { message: '팔로워 횟수는 숫자여야 합니다.' })
  @IsOptional()
  totalFollowers?: number;

  @Field(_return => Boolean, { nullable: true })
  @IsBoolean({ message: '팔로잉 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isMe?: boolean;

  @Field(_return => Boolean, { nullable: true })
  @IsBoolean({ message: '팔로잉 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isFollowing?: boolean;
}
