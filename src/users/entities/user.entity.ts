import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsEmail, IsString, Matches, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Field(_type => String)
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @Field(_type => String, { nullable: true })
  @IsString({ message: '닉네임는 문자열이어야 합니다.' })
  @IsOptional()
  username?: string;

  @Field(_type => String)
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @Transform(({ value }) => value && value.trim())
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,20}$/, {
    message: '비밀번호는 6~20자의 영문, 숫자, 특수문자로 구성되어야 합니다.',
  })
  password: string;

  @Field(_type => String, { nullable: true })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsOptional()
  name?: string;

  @Field(_type => String, { nullable: true })
  @IsString({ message: '지역은 문자열이어야 합니다.' })
  @IsOptional()
  location?: string;

  @Field(_type => String, { nullable: true })
  @IsString({ message: '프로필 사진은 문자열이어야 합니다.' })
  @IsOptional()
  avatarUrl?: string;

  @Field(_type => String, { nullable: true })
  @IsString({ message: '깃허브 닉네임는 문자열이어야 합니다.' })
  @IsOptional()
  githubUsername?: string;
}
