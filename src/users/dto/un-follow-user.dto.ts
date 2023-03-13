import { PickType, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dto/output.dto';

@InputType()
export class UnFollowUserInput extends PickType(User, ['email']) {}

@ObjectType()
export class UnFollowUserOutput extends CoreOutput {}
