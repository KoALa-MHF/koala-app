import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ToolbarsService } from './toolbars.service';
import { Toolbar } from './entities/toolbar.entity';
import { CreateToolbarInput } from './dto/create-toolbar.input';
import { UpdateToolbarInput } from './dto/update-toolbar.input';

@Resolver(() => Toolbar)
export class ToolbarsResolver {
  constructor(private readonly toolbarsService: ToolbarsService) {}

  @Mutation(() => Toolbar)
  createToolbar(@Args('createToolbarInput') createToolbarInput: CreateToolbarInput) {
    return this.toolbarsService.create(createToolbarInput);
  }

  @Query(
    () => [
      Toolbar,
    ],
    { name: 'toolbars' }
  )
  findAll() {
    return this.toolbarsService.findAll();
  }

  @Query(() => Toolbar, { name: 'toolbar' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.toolbarsService.findOne(id);
  }

  @Mutation(() => Toolbar)
  updateToolbar(@Args('updateToolbarInput') updateToolbarInput: UpdateToolbarInput) {
    return this.toolbarsService.update(updateToolbarInput.id, updateToolbarInput);
  }

  @Mutation(() => Toolbar)
  removeToolbar(@Args('id', { type: () => Int }) id: number) {
    return this.toolbarsService.remove(id);
  }
}
