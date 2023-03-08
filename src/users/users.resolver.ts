import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoreOutput } from '../common/dto/output.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateAccountOutput, CreateAccountInput } from './dto/create-account.dto';

@Resolver((_of?: void) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(_returns => CoreOutput)
  hi() {
    return {
      ok: true,
    };
  }
  @Mutation(_returns => CreateAccountOutput)
  async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }
}
