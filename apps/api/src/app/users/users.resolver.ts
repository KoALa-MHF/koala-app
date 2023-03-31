import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'me' })
  me(@Req() req) {
    console.log('---------->', req.user);
    return this.usersService.findOne(req.user.id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput
  ) {
    return this.usersService.update(id, updateUserInput);
  }
}
