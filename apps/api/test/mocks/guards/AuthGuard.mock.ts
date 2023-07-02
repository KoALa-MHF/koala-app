import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '../../../src/app/core/guards/auth.guard';
import { UsersData } from '../../../src/app/seed/data/users.data';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  canActivate(context: ExecutionContext) {
    const req = this.getRequest(context);
    if (req.headers.authorization) {
      const userId = req.headers.authorization.split(' ')[1];

      req.user = Object.values(UsersData).find((user) => {
        return user.id == userId;
      });
    }
    this.handleRequest(null, req.user, null, context);
    return true;
  }
}
