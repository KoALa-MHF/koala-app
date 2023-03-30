import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthenticateSessionInput } from './dto/authenticate-session.input';
import { AuthenticateUserSessionInput } from './dto/authenticate-user-session.input';
import { Authentication } from './models/autentication.model';

@Resolver(() => Authentication)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Authentication)
  authenticateUserSession(
    @Args('authenticateUserSessionInput')
    authenticateUserSessionInput: AuthenticateUserSessionInput
  ) {
    return this.authService.authenticateUserSession(authenticateUserSessionInput.code);
  }

  @Mutation(() => Authentication)
  authenticateSession(
    @Args('authenticateSessionInput')
    authenticateSessionInput: AuthenticateSessionInput
  ) {
    return this.authService.authenticateSession(authenticateSessionInput.code);
  }
}
