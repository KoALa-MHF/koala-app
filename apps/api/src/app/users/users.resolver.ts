import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'me' })
  me(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput
  ) {
    return this.usersService.update(id, updateUserInput);
  }
}
