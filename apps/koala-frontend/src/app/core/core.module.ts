import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    DividerModule,
    MenuModule,
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
})
export class CoreModule {}
