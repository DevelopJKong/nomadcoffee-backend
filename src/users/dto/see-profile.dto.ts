import { CoreOutput } from '../../common/dto/output.dto';
import { PickType, InputType, ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeProfileInput extends PickType(User, ['id']) {}

@ObjectType()
export class SeeProfileOutput extends CoreOutput {
  @Field(_returns => User)
  @IsOptional()
  user?: User;
}
