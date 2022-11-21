import { CreateMarkerInput } from './create-marker.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMarkerInput extends PartialType(CreateMarkerInput) {
}
