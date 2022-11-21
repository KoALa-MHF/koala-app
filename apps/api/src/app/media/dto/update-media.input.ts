import { CreateMediaInput } from './create-media.input';
import { InputType, PartialType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateMediaInput extends PartialType(
  OmitType(CreateMediaInput, ['type'] as const)
) {

}
