import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

export enum MediaType {
  AUDIO = 'audio',
}

registerEnumType(MediaType, {
  name: 'MediaType',
});

@ObjectType()
@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'ID for Media' })
  id: number;

  @Column({
    type: 'simple-enum',
    enum: MediaType,
  })
  @Field(() => MediaType, { description: 'Media Type' })
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @Column()
  @Field({ description: 'Media Title' })
  @IsNotEmpty()
  title: string;

  @Column()
  @Field({ description: 'Media Composer' })
  composer: string;
}
