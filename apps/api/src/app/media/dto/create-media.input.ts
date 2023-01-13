import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateMediaInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}
