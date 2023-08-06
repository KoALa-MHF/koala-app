import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { CreateMediaInput } from './dto/create-media.input';
import { AuthGuard } from '../core/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { RegisteredUserGuard } from '../core/guards/registerd-user.guard';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => Media)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  createMedia(@Args('createMediaInput') createMediaInput: CreateMediaInput) {
    return this.mediaService.create(createMediaInput);
  }
}
