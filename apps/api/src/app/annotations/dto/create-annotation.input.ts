import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAnnotationInput {
  @Field(() => Int, { description: 'Annotation Start Seconds' })
  @IsNotEmpty()
  start: number;

  @Field(() => Int, { nullable: true, description: 'Annotation End Seconds' })
  end?: number;

  @Field(() => Int, { description: 'Associated Marker' })
  @IsNotEmpty()
  markerId: number;
}
