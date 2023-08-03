import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkersRoutingModule } from './markers-routing.module';
import { MarkersOverviewPage } from './pages/markers-overview/markers-overview.page';
import { MarkerOverviewListComponent } from './components/marker-overview-list/marker-overview-list.component';
import { SharedModule } from '../../shared/shared.module';
import { MarkerButtonComponent } from './components/marker-button/marker-button.component';
import { MarkerIconComponent } from './components/marker-icon/marker-icon.component';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { MarkerPreviewComponent } from './components/marker-preview/marker-preview.component';
import { MarkersService } from './services/markers.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    MarkersOverviewPage,
    MarkerOverviewListComponent,
    MarkerButtonComponent,
    MarkerIconComponent,
    MarkerPreviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MarkersRoutingModule,
    SliderModule,
    TableModule,
    InputTextModule,
    DropdownModule,
  ],
  exports: [
    MarkerOverviewListComponent,
    MarkerButtonComponent,
    MarkerIconComponent,
    MarkerPreviewComponent,
  ],
  providers: [
    MarkersService,
  ],
})
export class MarkersModule {}
