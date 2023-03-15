import { Module } from '@nestjs/common';
import { CoffeeShopsResolver } from './coffee-shops.resolver';
import { CoffeeShopsService } from './coffee-shops.service';
import { CoffeeShopsRepository } from './repository/coffee-shops.repository';

@Module({
  imports: [],
  providers: [CoffeeShopsResolver, CoffeeShopsService, CoffeeShopsRepository],
  exports: [CoffeeShopsService],
})
export class CoffeeShopsModule {}
