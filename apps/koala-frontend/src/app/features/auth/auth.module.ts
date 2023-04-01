import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './pages/login-page/login.page';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';

import { AuthRoutingModule } from './auth-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    LoginPage,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    ImageModule,
    AuthRoutingModule,
    DialogModule,
  ],
  exports: [
    LoginPage,
    UserProfileComponent,
  ],
  providers: [
    AuthGuard,
  ],
})
export class AuthModule {}
