import { CreateAnnotationInput } from './create-annotation.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnnotationInput extends PartialType(
  OmitType(CreateAnnotationInput, [
    'userSessionId',
    'start',
    'end',
    'markerId',
  ] as const)
) {}
