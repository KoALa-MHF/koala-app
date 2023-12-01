import { InputType, Field } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { COMMENT_TEXT_MAX_LENGTH } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput {
  @Field({ description: 'Comment Text' })
  @MaxLength(COMMENT_TEXT_MAX_LENGTH)
  text: string;
}
