import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { ToolbarsService } from './toolbars.service';
import { Toolbar } from './entities/toolbar.entity';
import { UpdateToolbarInput } from './dto/update-toolbar.input';

@Resolver(() => Toolbar)
export class ToolbarsResolver {
  constructor(private readonly toolbarsService: ToolbarsService) {}

  @Mutation(() => Toolbar)
  updateToolbar(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateToolbarInput') updateToolbarInput: UpdateToolbarInput
  ) {
    return this.toolbarsService.update(id, updateToolbarInput);
  }
}
