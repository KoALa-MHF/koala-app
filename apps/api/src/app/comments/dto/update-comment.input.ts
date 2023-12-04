import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class UpdateCommentInput extends PartialType(
  OmitType(CreateCommentInput, [
    'annotationId',
  ] as const)
) {}
