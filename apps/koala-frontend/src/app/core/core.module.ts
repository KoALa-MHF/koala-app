import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { SharedModule } from '../shared/shared.module';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SidebarModule } from 'primeng/sidebar';
import { AboutPage } from './pages/about/about.page';
import { ImprintPage } from './pages/imprint/imprint.page';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AboutPage,
    ImprintPage,
  ],
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    DividerModule,
    MenuModule,
    SharedModule,
    ImageModule,
    OverlayPanelModule,
    ToggleButtonModule,
    SidebarModule,
    CoreRoutingModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
})
export class CoreModule {}
