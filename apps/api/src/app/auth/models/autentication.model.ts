import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Authentication {
  @Field({ description: 'JWT Bearer Token' })
  accessToken: string;
}
