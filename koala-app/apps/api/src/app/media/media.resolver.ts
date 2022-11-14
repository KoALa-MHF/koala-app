import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => Media)
  createMedia(@Args('createMediaInput') createMediaInput: CreateMediaInput) {
    return this.mediaService.create(createMediaInput);
  }

  @Query(() => [Media], { name: 'allMedia' })
  findAll() {
    return this.mediaService.findAll();
  }

  @Query(() => Media, { name: 'media' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mediaService.findOne(id);
  }

  @Mutation(() => Media)
  updateMedia(@Args('id', { type: () => Int }) id: number, @Args('updateMediaInput') updateMediaInput: UpdateMediaInput) {
    return this.mediaService.update(id, updateMediaInput);
  }

  @Mutation(() => Media)
  removeMedia(@Args('id', { type: () => Int }) id: number) {
    return this.mediaService.remove(id);
  }
}
