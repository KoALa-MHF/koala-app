import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserSessionsService } from './user-sessions.service';
import { UserSession } from './entities/user-session.entity';
import { CreateUserSessionInput } from './dto/create-user-session.input';
import { UpdateUserSessionInput } from './dto/update-user-session.input';
import { InviteUserSessionInput } from './dto/invite-user-session.input';
import { SessionsService } from '../sessions/sessions.service';
import { forwardRef, Inject } from '@nestjs/common';
import { AnnotationsService } from '../annotations/annotations.service';

@Resolver(() => UserSession)
export class UserSessionsResolver {
  constructor(
    private readonly userSessionsService: UserSessionsService,
    private readonly sessionsService: SessionsService,
    @Inject(forwardRef(() => AnnotationsService))
    private readonly annotationsService: AnnotationsService
  ) {}

  @Mutation(() => UserSession)
  createUserSession(
    @Args('createUserSessionInput')
    createUserSessionInput: CreateUserSessionInput
  ) {
    return this.userSessionsService.create(createUserSessionInput);
  }

  @Mutation(() => [
    UserSession,
  ])
  inviteUserSession(
    @Args('inviteUserSessionInput')
    inviteUserSessionInput: InviteUserSessionInput
  ) {
    return this.userSessionsService.invite(inviteUserSessionInput.userSessionIds, inviteUserSessionInput.message);
  }

  @Query(
    () => [
      UserSession,
    ],
    { name: 'userSessions' }
  )
  findAll() {
    return this.userSessionsService.findAll();
  }

  @Query(() => UserSession, { name: 'userSession' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userSessionsService.findOne(id);
  }

  @Mutation(() => UserSession)
  updateUserSession(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserSessionInput')
    updateUserSessionInput: UpdateUserSessionInput
  ) {
    return this.userSessionsService.update(id, updateUserSessionInput);
  }

  @Mutation(() => UserSession)
  removeUserSession(@Args('id', { type: () => Int }) id: number) {
    return this.userSessionsService.remove(id);
  }

  @ResolveField()
  async session(@Parent() userSession: UserSession) {
    const { sessionId } = userSession;
    return this.sessionsService.findOne(sessionId, true);
  }

  @ResolveField()
  async annotations(@Parent() userSession: UserSession) {
    const { id } = userSession;
    return this.annotationsService.findAll(id);
  }
}
