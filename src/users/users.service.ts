import { Injectable } from '@nestjs/common';
import { CreateAccountOutput, CreateAccountInput } from './dto/create-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { IUserService } from './interfaces/users-resolver.interface';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { COMMON_ERROR, USER_ERROR } from '../common/constants/error.constant';
import { JwtService } from '../libs/jwt/jwt.service';
import { USER_SUCCESS } from '../common/constants/success.constant';
import { SeeProfileInput, SeeProfileOutput } from './dto/see-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { join } from 'path';
import { BACKEND_URL, fileFolder } from 'src/common/common.constant';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
import { UploadsService } from '../libs/uploads/uploads.service';
@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly uploadsService: UploadsService,
  ) {}
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

      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND));

      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          ...(username && { username }),
          ...(name && { name }),
          ...(location && { location }),
          ...(avatarUrl && { avatarUrl }),
          ...(githubUsername && { githubUsername }),
        },
      });

      // * 유저 생성 완료
      return {
        ok: true,
        message: USER_SUCCESS.createAccount.text,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // ! 존재하지 않는 유저
      if (!user) {
        return {
          ok: false,
          error: new Error(USER_ERROR.notExistUser.text),
        };
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      // ! 비밀번호가 틀림
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: new Error(USER_ERROR.wrongPassword.text),
        };
      }

      const token = this.jwtService.sign({ id: user.id });

      // * 로그인 성공
      return {
        ok: true,
        message: USER_SUCCESS.login.text,
        token,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }
  async seeProfile(_: number, { id }: SeeProfileInput): Promise<SeeProfileOutput> {
    try {
      // ! 존재하지 않는 유저
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return {
          ok: false,
          error: new Error(USER_ERROR.notExistUser.text),
        };
      }

      // * 유저 정보 조회 성공
      return {
        ok: true,
        message: USER_SUCCESS.seeProfile.text,
        user,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }

  async editProfile(
    userId: number,
    { email, password: newPassword, name, username, location, avatarField, githubUsername }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      let filePath: string;
      let avatarFilePath: string;
      if (avatarField) {
        const { createReadStream, filename } = await avatarField;
        const userFileFolder = join(fileFolder, './user');

        // ! 개발 환경에서 파일 저장
        if (process.env.NODE_ENV === 'dev') {
          if (!fs.existsSync(userFileFolder)) {
            fs.mkdirSync(userFileFolder);
          }
          const devResult = createReadStream().pipe(createWriteStream(join(userFileFolder, `./${filename}`)));
          filePath = devResult.path as string;
          avatarFilePath = `${BACKEND_URL}` + join('/files', filePath.split(fileFolder)[1]);
        }

        // ! 배포 환경에서 파일 저장
        if (process.env.NODE_ENV === 'prod') {
          avatarFilePath = await this.uploadsService.uploadFile(avatarField, userId, 'avatar');
        }
      }
      let hashedPassword: string;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email,
          username,
          name,
          location,
          ...(avatarFilePath && { avatar: avatarFilePath }),
          ...(hashedPassword && { password: hashedPassword }),
          ...(githubUsername && { githubUsername }),
        },
      });

      if (!updatedUser.id) {
        // ! 유저가 없을 경우
        return {
          ok: false,
          error: new Error(USER_ERROR.notExistUser.text),
        };
      }
      return {
        ok: true,
        message: USER_SUCCESS.editProfile.text,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }
}
