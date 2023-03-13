import { CreateAccountInput, CreateAccountOutput } from '../dto/create-account.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { EditProfileInput, EditProfileOutput } from '../dto/edit-profile.dto';
import { SeeProfileInput, SeeProfileOutput } from '../dto/see-profile.dto';
import * as winston from 'winston';
import { User } from '../entities/user.entity';
import { FollowUserInput, FollowUserOutput } from '../dto/follow-user.dto';
import { UnFollowUserInput, UnFollowUserOutput } from '../dto/un-follow-user.dto';
export interface IUserService {
  totalFollowing(id: number): Promise<number>;
  totalFollowers(id: number): Promise<number>;
  isMe(user: User, id: number): boolean;
  isFollowing(user: User, id: number): Promise<boolean>;
  successLogger(service: { name: string }, method: string): winston.Logger;
  createAccount(createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>;
  login(loginInput: LoginInput): Promise<LoginOutput>;
  seeProfile(userId: number, seeProfileInput: SeeProfileInput): Promise<SeeProfileOutput>;
  editProfile(userId: number, editProfileInput: EditProfileInput): Promise<EditProfileOutput>;
  followUser(userId: number, { username }: FollowUserInput): Promise<FollowUserOutput>;
  unFollowUser(userId: number, { username }: UnFollowUserInput): Promise<UnFollowUserOutput>;
}
