import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './pages/login-page/login.page';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';

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
  ],
  exports: [
    LoginPage,
  ],
})
export class AuthModule {}
