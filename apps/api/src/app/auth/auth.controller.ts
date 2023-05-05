import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SamlAuthGuard } from '../core/guards/saml-auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('sso/saml/login')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    //this route is handled by passport-saml
    return;
  }

  @Post('sso/saml/ac')
  @UseGuards(SamlAuthGuard)
  async samlAssertionConsumer(@Req() req, @Res() res) {
    const user: User = req.user;
    if (user) {
      console.log('USER', user);
      const authentication = await this.authService.authenticateSamlUser(user);
      res.redirect('/?jwt=' + authentication.accessToken);
    }
  }
}
