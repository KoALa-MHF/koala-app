import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Authentication {
  @Field({ description: 'JWT Bearer Token' })
  accessToken: string;

  @Field((type) => User, { description: 'Authenticated user' })
  user: User;

  userId: number;
}
