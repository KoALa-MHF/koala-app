import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarkersService } from './markers.service';
import { Marker } from './entities/marker.entity';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';

@Resolver(() => Marker)
export class MarkersResolver {
  constructor(private readonly markersService: MarkersService) {}

  @Mutation(() => Marker)
  createMarker(@Args('createMarkerInput') createMarkerInput: CreateMarkerInput) {
    return this.markersService.create(createMarkerInput);
  }

  @Query(
    () => [
      Marker,
    ],
    { name: 'markers' }
  )
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
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.markersService.findOne(id);
  }

  @Mutation(() => Marker)
  updateMarker(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMarkerInput') updateMarkerInput: UpdateMarkerInput
  ) {
    return this.markersService.update(id, updateMarkerInput);
  }

  @Mutation(() => Marker)
  removeMarker(@Args('id', { type: () => Int }) id: number) {
    return this.markersService.remove(id);
  }
}
