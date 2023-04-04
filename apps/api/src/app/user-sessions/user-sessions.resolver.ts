import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserSessionsService } from './user-sessions.service';
import { UserSession } from './entities/user-session.entity';
import { CreateUserSessionInput } from './dto/create-user-session.input';
import { UpdateUserSessionInput } from './dto/update-user-session.input';
import { InviteUserSessionInput } from './dto/invite-user-session.input';
import { SessionsService } from '../sessions/sessions.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { AnnotationsService } from '../annotations/annotations.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => UserSession)
@UseGuards(AuthGuard)
export class UserSessionsResolver {
  constructor(
    private readonly userSessionsService: UserSessionsService,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionsService: SessionsService,
    @Inject(forwardRef(() => AnnotationsService))
    private readonly annotationsService: AnnotationsService,
    private readonly usersService: UsersService
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
  findAll(@CurrentUser() user: User) {
    return this.userSessionsService.findAll(user);
  }

  @Query(() => UserSession, { name: 'userSession' })
  findOne(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.userSessionsService.findOne(id, user);
  }

  @Mutation(() => UserSession)
  updateUserSession(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserSessionInput') updateUserSessionInput: UpdateUserSessionInput,
    @CurrentUser() user: User
  ) {
    return this.userSessionsService.update(id, updateUserSessionInput, user);
  }

  @Mutation(() => UserSession)
  removeUserSession(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.userSessionsService.remove(id, user);
  }

  @ResolveField()
  session(@Parent() userSession: UserSession) {
    const { sessionId } = userSession;
    return this.sessionsService.findOne(sessionId, true);
  }

  @ResolveField()
  user(@Parent() userSession: UserSession) {
    const { userId } = userSession;
    return this.usersService.findOne(userId);
  }

  @ResolveField()
  annotations(@Parent() userSession: UserSession) {
    const { id } = userSession;
    return this.annotationsService.findAllByUserSession(id);
  }
}
