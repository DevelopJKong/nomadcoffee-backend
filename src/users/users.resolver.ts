import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from '../common/dto/output.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateAccountOutput, CreateAccountInput } from './dto/create-account.dto';
import { LoginOutput, LoginInput } from './dto/login.dto';
import { SeeProfileOutput, SeeProfileInput } from './dto/see-profile.dto';
import { Role } from 'src/libs/auth/role.decorator';
import { AuthUser } from '../libs/auth/auth-user.decorator';
import { RoleData } from '@prisma/client';
import { EditProfileOutput, EditProfileInput } from './dto/edit-profile.dto';

@Resolver((_of?: void) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(_returns => CoreOutput)
  hi() {
    return {
      ok: true,
    };
  }

  @Query(_returns => SeeProfileOutput)
  @Role([RoleData.USER])
  async seeProfile(
    @AuthUser() authUser: User,
    @Args('input') seeProfileInput: SeeProfileInput,
  ): Promise<SeeProfileOutput> {
    return this.usersService.seeProfile(authUser.id, seeProfileInput);
  }

  @Mutation(_returns => CreateAccountOutput)
  async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(_returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation(_returns => EditProfileOutput)
  @Role([RoleData.USER])
  async editProfile(@AuthUser() authUser: User, @Args('input') editProfileInput: EditProfileInput) {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }
}
