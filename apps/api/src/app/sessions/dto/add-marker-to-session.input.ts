import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddMarkerToSessionInput {
  @Field(() => Int, { description: 'Session ID' })
  @IsNotEmpty()
  sessionId: number;

  @Field(() => Int, { description: 'Associated Marker' })
  @IsNotEmpty()
  markerId: number;
}
