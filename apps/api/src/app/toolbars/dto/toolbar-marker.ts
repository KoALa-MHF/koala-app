import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Marker } from '../../markers/entities/marker.entity';

@ObjectType()
export class ToolbarMarker {
  @Field(() => Marker, { description: 'Marker' })
  marker: Marker;

  @Field(() => Boolean)
  visible: boolean;
}
