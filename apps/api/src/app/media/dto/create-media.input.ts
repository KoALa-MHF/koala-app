import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '../entities/media.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class CreateMediaInput {
  @Field(() => MediaType, { description: 'Media Type' })
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @Field({ description: 'Media Title' })
  @IsNotEmpty()
  title: string;

  @Field({ description: 'Media Composer' })
  composer: string;

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}
