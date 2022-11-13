import { CreateMediaInput } from './create-media.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '../entities/media.entity';

@InputType()
export class UpdateMediaInput extends PartialType(CreateMediaInput) {
  @Field(() => Int)
  id: number;

  @Field(() => MediaType, { description: 'Media Type' })
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @Field({ description: 'Media Title' })
  @IsNotEmpty()
  title: string;

  @Field({ description: 'Media Composer' })
  composer: string;
}
