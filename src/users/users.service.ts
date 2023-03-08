import { Injectable } from '@nestjs/common';
import { CreateAccountOutput, CreateAccountInput } from './dto/create-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { IUserService } from './interfaces/users-resolver.interface';
@Injectable()
export class UsersService implements IUserService {
  constructor(private readonly prisma: PrismaService) {}
  async createAccount({
    email,
    password,
    username,
    name,
    location,
    avatarUrl,
    githubUsername,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      // ! 이미 데이터베이스에 닉네임과 이메일이 존재하는지 확인
      const exists = await this.prisma.user.findFirst({
        where: {
          OR: [{ username }],
        },
      });
      if (exists) {
        // ! 유저 네임이 이미 존재할 경우
        return {
          ok: false,
          error: new Error('유저 네임이 이미 존재할 경우'),
        };
      }

      const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUND);

      await this.prisma.user.create({
        data: {
          name,
          location,
          email,
          username,
          password: hashedPassword,
          avatarUrl,
          githubUsername,
        },
      });

      // * 유저 생성 완료
      return {
        ok: true,
        message: '유저 생성 완료',
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}
