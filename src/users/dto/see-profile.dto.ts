import { PickType, InputType, ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { IsOptional } from 'class-validator';
import { PaginationOutput } from '../../common/dto/pagination.dto';

@InputType()
export class SeeProfileInput extends PickType(User, ['id']) {}

@ObjectType()
export class SeeProfileOutput extends PaginationOutput {
  @Field(_returns => User)
  @IsOptional()
  user?: User;
}
