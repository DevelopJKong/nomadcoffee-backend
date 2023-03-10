import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
