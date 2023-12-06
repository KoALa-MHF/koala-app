import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Config } from '../config/config';
import { SamlAuthGuard } from '../core/guards/saml-auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { SamlAuthOptionGuard } from '../core/guards/saml-auth-option.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly config: Config) {}

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
      const authentication = await this.authService.authenticateSamlUser(user);
      res.redirect(this.config.saml.redirectFrontendUrl + authentication.accessToken);
    }
  }

  @Get('sso/saml/loginOption')
  @UseGuards(SamlAuthOptionGuard)
  async samlLoginOption() {
    //this route is handled by passport-saml
    return;
  }

  @Post('sso/saml/option/ac')
  @UseGuards(SamlAuthOptionGuard)
  async samlOptionAssertionConsumer(@Req() req, @Res() res) {
    const user: User = req.user;
    if (user) {
      const authentication = await this.authService.authenticateSamlUser(user);
      res.redirect(this.config.saml.redirectFrontendUrl + authentication.accessToken);
    }
  }
}
