import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '../../../src/app/core/guards/auth.guard';
import { User } from '../../../src/app/users/entities/user.entity';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  canActivate(context: ExecutionContext) {
    const req = this.getRequest(context);
    if (req.headers.authorization) {
      const user = new User();
      user.id = 1;
      user.displayName = 'Some Name';
      user.createdAt = new Date();
      user.samlId = '123456';
      user.email = 'test@koala-app.de';

      req.user = user; // Your user object
    }
    this.handleRequest(null, req.user, null, context);
    return true;
  }
}
