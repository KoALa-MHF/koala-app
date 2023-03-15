import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './pages/login-page/login.page';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    ImageModule,
    AuthRoutingModule,
  ],
  exports: [
    LoginPage,
  ],
})
export class AuthModule {}
