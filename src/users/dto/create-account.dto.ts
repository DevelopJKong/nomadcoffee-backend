import { InputType, ObjectType, PickType, PartialType } from '@nestjs/graphql';
import { User } from './../entities/user.entity';
import { CoreOutput } from '../../common/dto/output.dto';

@InputType()
export class CreateAccountInput extends PartialType(
  PickType(User, ['email', 'username', 'password', 'name', 'location', 'avatarUrl', 'githubUsername'] as const),
) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
