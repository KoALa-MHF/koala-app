import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { CreateMediaInput } from './dto/create-media.input';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => Media)
  createMedia(@Args('createMediaInput') createMediaInput: CreateMediaInput) {
    return this.mediaService.create(createMediaInput);
  }
}
