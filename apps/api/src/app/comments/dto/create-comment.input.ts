import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { COMMENT_TEXT_MAX_LENGTH } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput {
  @Field(() => Int, { description: 'Associated Annotation' })
  @IsNotEmpty()
  annotationId: number;

  @Field({ description: 'Comment Text' })
  @MaxLength(COMMENT_TEXT_MAX_LENGTH)
  text: string;
}
