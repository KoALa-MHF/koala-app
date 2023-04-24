import { Resolver, Mutation, Args, Int, ResolveField, Parent, Subscription, ID } from '@nestjs/graphql';
import { ToolbarsService } from './toolbars.service';
import { Toolbar } from './entities/toolbar.entity';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { SessionsService } from '../sessions/sessions.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Toolbar)
@UseGuards(AuthGuard)
export class ToolbarsResolver {
  constructor(
    private readonly toolbarsService: ToolbarsService,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionService: SessionsService
  ) {}

  @Mutation(() => Toolbar)
  updateToolbar(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateToolbarInput') updateToolbarInput: UpdateToolbarInput,
    @CurrentUser() user: User
  ) {

    const toolbar = this.toolbarsService.update(id, updateToolbarInput, user);
    pubSub.publish('toolbarUpdated', { toolbarUpdated: toolbar });
    return toolbar;
  }

  @ResolveField()
  async session(@Parent() toolbar: Toolbar, @CurrentUser() user: User) {
    const { sessionId } = toolbar;
    return this.sessionService.findOne(sessionId, user);
  }

  @Subscription((returns) => Toolbar, {
    filter: async (payload, variables) => {
      const payloadResult = await payload.toolbarUpdated;

      return payloadResult.id == variables.id;
    },
  })
  toolbarUpdated(@Args('id', { type: () => ID }) id: number) {
    return pubSub.asyncIterator('toolbarUpdated');
  }
}
