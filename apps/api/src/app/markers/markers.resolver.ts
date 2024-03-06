import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { MarkersService } from './markers.service';
import { Marker } from './entities/marker.entity';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { RegisteredUserGuard } from '../core/guards/registerd-user.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Resolver(() => Marker)
@UseGuards(AuthGuard)
export class MarkersResolver {
  constructor(private readonly markersService: MarkersService, private readonly usersService: UsersService) {}

  @Mutation(() => Marker)
  @UseGuards(RegisteredUserGuard)
  createMarker(@Args('createMarkerInput') createMarkerInput: CreateMarkerInput, @CurrentUser() user: User) {
    return this.markersService.create(createMarkerInput, user);
  }

  @Query(
    () => [
      Marker,
    ],
    { name: 'markers' }
  )
  @UseGuards(RegisteredUserGuard)
  findAll(
    @Args('ids', {
      type: () => [
        Int,
      ],
      nullable: true,
    })
    ids?: Array<number>
  ) {
    return this.markersService.findAll(ids);
  }

  @Query(() => Marker, { name: 'marker' })
  @UseGuards(RegisteredUserGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.markersService.findOne(id);
  }

  @Mutation(() => Marker)
  @UseGuards(RegisteredUserGuard)
  updateMarker(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMarkerInput') updateMarkerInput: UpdateMarkerInput,
    @CurrentUser() user: User
  ) {
    return this.markersService.update(id, updateMarkerInput, user);
  }

  @Mutation(() => Marker)
  @UseGuards(RegisteredUserGuard)
  removeMarker(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.markersService.remove(id, user);
  }

  @ResolveField()
  owner(@Parent() marker: Marker) {
    const { ownerId } = marker;
    return this.usersService.findOne(ownerId);
  }
}
