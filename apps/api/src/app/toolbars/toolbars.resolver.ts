import { Resolver, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ToolbarsService } from './toolbars.service';
import { Toolbar } from './entities/toolbar.entity';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { SessionsService } from '../sessions/sessions.service';
import { forwardRef, Inject } from '@nestjs/common';

@Resolver(() => Toolbar)
export class ToolbarsResolver {
  constructor(
    private readonly toolbarsService: ToolbarsService,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionService: SessionsService
  ) {}

  @Mutation(() => Toolbar)
  updateToolbar(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateToolbarInput') updateToolbarInput: UpdateToolbarInput
  ) {
    return this.toolbarsService.update(id, updateToolbarInput);
  }

  @ResolveField()
  async session(@Parent() toolbar: Toolbar) {
    const { sessionId } = toolbar;
    return this.sessionService.findOne(sessionId, true);
  }
}
