import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Session } from '../../sessions/entities/session.entity';
import { ToolbarMarker } from './toolbar-marker';
import { BaseEntity } from '../../core/base.entity';

@ObjectType()
export class Toolbar extends BaseEntity {
  @Field(() => ID, { description: 'ID for Media' })
  id: number;

  @Field((type) => Session, { description: 'Associated Session' })
  @IsNotEmpty()
  session: Session;

  @Field(
    (type) => [
      ToolbarMarker,
    ],
    { defaultValue: [], nullable: true }
  )
  markers: ToolbarMarker[];
}
