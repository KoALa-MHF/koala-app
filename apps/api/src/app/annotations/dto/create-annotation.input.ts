import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ANNOTATION_NOTE_MAX_LENGTH } from '../entities/annotation.entity';

@InputType()
export class CreateAnnotationInput {
  @Field(() => Int, { description: 'Annotation Start Seconds' })
  @IsNotEmpty()
  start: number;

  @Field(() => Int, { nullable: true, description: 'Annotation End Seconds' })
  end?: number;

  @Field(() => Int, { nullable: true, description: 'Annotation Value' })
  value?: number;

  @Field(() => Int, { description: 'Associated Marker' })
  @IsNotEmpty()
  markerId: number;

  @Field(() => Int, { description: 'Associated User Session' })
  @IsNotEmpty()
  userSessionId: number;

  @Field({ defaultValue: '', description: 'Annotation Note' })
  @MaxLength(ANNOTATION_NOTE_MAX_LENGTH)
  @IsOptional()
  note?: string;
}
