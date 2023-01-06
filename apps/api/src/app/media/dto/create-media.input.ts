import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '../entities/media.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateMediaInput {
  @Field(() => MediaType, { description: 'Media Type' })
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}
