import { Resolver, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ToolbarsService } from './toolbars.service';
import { Toolbar } from './entities/toolbar.entity';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { SessionsService } from '../sessions/sessions.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

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
    return this.toolbarsService.update(id, updateToolbarInput, user);
  }

  @ResolveField()
  async session(@Parent() toolbar: Toolbar, @CurrentUser() user: User) {
    const { sessionId } = toolbar;
    return this.sessionService.findOne(sessionId, user);
  }
}
