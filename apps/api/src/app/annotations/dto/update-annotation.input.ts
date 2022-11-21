import { CreateAnnotationInput } from './create-annotation.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnnotationInput extends PartialType(CreateAnnotationInput) {

}
