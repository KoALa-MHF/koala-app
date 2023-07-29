import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkersRoutingModule } from './markers-routing.module';
import { MarkersOverviewPage } from './pages/markers-overview/markers-overview.page';

@NgModule({
  declarations: [
    MarkersOverviewPage,
  ],
  imports: [
    CommonModule,
    MarkersRoutingModule,
  ],
})
export class MarkersModule {}
