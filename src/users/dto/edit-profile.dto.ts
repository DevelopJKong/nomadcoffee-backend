import { PickType, PartialType, Field, ObjectType, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsOptional } from 'class-validator';
import { CoreOutput } from '../../common/dto/output.dto';
import { FileUpload } from 'src/common/common.interface';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'username', 'password', 'name', 'location', 'githubUsername']),
) {
  @Field(_type => GraphQLUpload, { nullable: true })
  @IsOptional()
  avatarField?: Promise<FileUpload>;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
