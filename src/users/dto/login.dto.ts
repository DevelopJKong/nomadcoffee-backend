import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dto/output.dto';
import { IsEmail, Matches, IsString, IsJWT, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class LoginInput {
  @Field(_type => String)
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @Field(_type => String)
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @Transform(params => params.value.trim())
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@#$!%*?&]{5,20}$/)
  password: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(_type => String, { nullable: true })
  @IsJWT({ message: '유효하지 않은 토큰입니다.' })
  @IsOptional()
  token?: string;
}
