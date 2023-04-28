import { Resolver, Mutation, Args, Int, ResolveField, Parent, Subscription, ID } from '@nestjs/graphql';
import { ToolbarsService } from './toolbars.service';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { SessionsService } from '../sessions/sessions.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { SetToolbarMarkerVisibilityInput } from './dto/set-toolbar-marker-visible.input';
import { Toolbar } from './dto/toolbar';

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
  async updateToolbar(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateToolbarInput') updateToolbarInput: UpdateToolbarInput,
    @CurrentUser() user: User
  ) {
    const toolbar = await this.toolbarsService.update(id, updateToolbarInput, user);

    pubSub.publish('toolbarUpdated', { toolbarUpdated: toolbar });
    return toolbar;
  }

  @Mutation(() => Toolbar)
  setMarkerVisible(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateToolbarMarkerVisible') setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput
  ) {
    return this.toolbarsService.setToolbarMarkerVisibility(id, setToolbarMarkerVisibilityInput);
  }

  @ResolveField()
  async session(@Parent() toolbar: Toolbar, @CurrentUser() user: User) {
    const { session } = toolbar;
    return this.sessionService.findOne(session.id, user);
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
