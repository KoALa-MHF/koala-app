import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SamlAuthGuard } from '../core/guards/saml-auth.guard';
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
    console.log('USER ---------->', req.user);
    //this routes gets executed on successful assertion from IdP
    if (req.user) {
      console.log('USER', req.user);
      res.redirect('/?jwt=' + 223232323);
    }
  }
}
