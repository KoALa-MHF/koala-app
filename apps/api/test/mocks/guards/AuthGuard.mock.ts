import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '../../../src/app/core/guards/auth.guard';
import { UsersData } from '../../../src/app/seed/data/users.data';
import { User } from '../../../src/app/users/entities/user.entity';

@Injectable()
export class AuthGuardMock extends AuthGuard {
  canActivate(context: ExecutionContext) {
    const req = this.getRequest(context);
    if (req.headers.authorization) {
      const userId = req.headers.authorization.split(' ')[1];

      const authUser = Object.values(UsersData).find((user) => {
        return user.id == userId;
      });

      if (authUser) {
        const user = new User();
        Object.assign(user, authUser);
        req.user = user;
      }
    }
    this.handleRequest(null, req.user, null, context);
    return true;
  }
}
