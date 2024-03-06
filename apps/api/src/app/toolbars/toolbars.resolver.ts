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
import { MarkersService } from '../markers/markers.service';

const pubSub = new PubSub();

@Resolver(() => Toolbar)
export class ToolbarsResolver {
  constructor(
    private readonly toolbarsService: ToolbarsService,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionService: SessionsService,
    private readonly markersService: MarkersService
  ) {}

  @Mutation(() => Toolbar)
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async setMarkerVisible(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateToolbarMarkerVisible') setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput
  ) {
    await this.toolbarsService.setToolbarMarkerVisibility(id, setToolbarMarkerVisibilityInput);

    const toolbar = await this.toolbarsService.findOne(id);
    pubSub.publish('toolbarUpdated', { toolbarUpdated: toolbar });
    return toolbar;
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  async session(@Parent() toolbar: Toolbar, @CurrentUser() user: User) {
    const { session } = toolbar;
    return this.sessionService.findOne(session.id, user);
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  async markers(@Parent() toolbar: Toolbar) {
    const { markers: toolbarMarkers } = toolbar;
    const ids = toolbarMarkers.map((toolbarMarker: any) => toolbarMarker.markerId);
    const markers = await this.markersService.findAll(ids);
    const returnToolbarMarkers = [];
    toolbarMarkers.forEach((toolbarMarker: any) => {
      const marker = markers.find((marker) => marker.id == toolbarMarker.markerId);
      if (marker) {
        returnToolbarMarkers.push({ marker, visible: toolbarMarker ? toolbarMarker.visible : true });
      }
    });
    return returnToolbarMarkers;
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
