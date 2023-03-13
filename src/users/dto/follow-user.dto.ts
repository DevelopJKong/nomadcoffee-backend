import { PickType, ObjectType, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dto/output.dto';

@InputType()
export class FollowUserInput extends PickType(User, ['email']) {}

@ObjectType()
export class FollowUserOutput extends CoreOutput {}
